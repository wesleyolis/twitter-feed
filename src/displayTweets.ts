import {Tweets, TUserTweet} from './Modules/tweets';
import {Users, TUserAndFollowers, TUser} from './Modules/users';
import {FileDataReader} from './Modules/DataReader/FileDataReader';

interface TFollowerAndUserTweet extends TUserTweet
{
    user : TUser;
} 

export class DisplayTweets
{
    public constructor(private tweetsPathAndFileNameExt : string, private usersPathAndFileNameExt : string)
    {

    }

    public Display()
    {
        let usersModule = new Users(new FileDataReader(this.usersPathAndFileNameExt));
        let tweetsModule = new Tweets(new FileDataReader(this.tweetsPathAndFileNameExt));

        let usersRecords = usersModule.parseUserRecords();
        let usersTweetRecords = tweetsModule.parseUserTweets();
           
        // since we are not able to use yeild in this version, or I am not able to figure it out in the time required.
        this.uniqueUsersFollowersMerged(usersRecords, (record) =>
        {
            let tweets : TFollowerAndUserTweet [] = [];

            let follows = record.follows.sort();

            let lastUser : TUser | undefined = undefined;

            [record.user, ... follows].forEach(user => {

                if (user != lastUser)
                {
                    let userTweets : TUserTweet [] = usersTweetRecords[user];
                    if (userTweets != undefined)
                        userTweets.forEach(t => tweets.push(<TFollowerAndUserTweet>{user:user, modstamp:t.modstamp, message: t.message}));

                }

                lastUser = user;
            })
            
            tweets.sort((a, b) => a.modstamp - b.modstamp);
            
            // Probably would be faster to buffer the string and then do bulk flushes, but leave that for another time.
            console.log(record.user +"\n\n");

            tweets.forEach(tweet =>
            {
                console.log("\t@" + tweet.user + ": " + tweet.message);
            })            
            
        });        

    }

    // Once could have just dont this all up front with dictionaries and hashing tables, but I felt this is different
    // and it does display alternative way to solving problems.
    // This function does assume that the records are already sorted.
    // Typically I would like to have an interface that backs any form of data being pushed around, that persist
    // the default nateral record ordering, so that one know when require to sort dataset or not, which allows one to
    // apply algorithms with out having to first sort.
    private uniqueUsersFollowersMerged(usersRecords : TUserAndFollowers [], processRecord : (record : TUserAndFollowers) => void) 
    {
        if (usersRecords.length > 0)
        {
            let lastUser : TUserAndFollowers = usersRecords[0];
            let firstDup : boolean = false;

            for (let i = 1;i < usersRecords.length; i++)
            {
                let currRecord = usersRecords[i];                

                if (lastUser.user == currRecord.user)
                {
                    if (!firstDup)
                    {
                        firstDup = true;
                        
                        let tempUser : TUserAndFollowers = {user: lastUser.user, follows : lastUser.follows.map(f => f) };
                        lastUser = tempUser;
                    }

                    let follows = lastUser.follows.concat(currRecord.follows);                    
                    lastUser.follows = follows;
                }
                else
                {   
                    if (firstDup) 
                    {
                        firstDup = false;                
                        lastUser.follows.sort()
                    }
                    // output last record
                    //yield lastUser;
                    processRecord(lastUser);
                }
                lastUser = currRecord;
            }
            processRecord(lastUser);
            //yield lastUser;
        }
    }
}