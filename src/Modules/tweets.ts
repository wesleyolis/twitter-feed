import {FileDataReader} from './DataReader/FileDataReader';
import {IDataReader} from './DataReader/IDataReader';
import {TUser} from './users'

export interface TUserTweet {modstamp:number, message:string};
export type TUserTweets = TUserTweet [];
export type TUsersTweets = {[index:string] : TUserTweets};

export class Tweets
{
    private usersTweetRecords : TUsersTweets | null = null;

    public constructor(private dataReader : IDataReader)
    {
    }

    public parseUserTweets() : TUsersTweets
    {
        let modstamp : number = 0;

        if (this.usersTweetRecords != null)
        {
            return this.usersTweetRecords;
        }
        this.usersTweetRecords = {};

        let data = this.dataReader.ReadAllData();

        // User
        // User >
        // User > message.
        // regular expression would have over head, but if one was to use less well formed data, then
        // it would be better to just use a regular expression as it would be much simpler and quick
        // than dealing with all the corner case mathermatics to be tollerant of certain charaters.
        // that or one would write the own left and right specialized trim functions to still ge more speed that heavier typicaly regular expression would be.
        // All just depends on the cost of things and how much money and time you really have avaliable.
        for (let pos = 0; pos < data.length; pos++)
        {            
            // Establish all the boundry points.
            let endOfUserPos = data.indexOf(">", pos);                
            let endOfMessagePos = data.indexOf("\r\n", endOfUserPos == -1 ? pos : endOfUserPos + 1);            

            // Fix all the found points incase their were not found.
            if (endOfMessagePos == -1)
                endOfMessagePos = data.length;

            if (endOfUserPos == -1)        
                endOfUserPos = endOfMessagePos;            
            
            let user : TUser = data.substring(pos, endOfUserPos);
            let message : string = "";
            
            endOfUserPos += 2;

            //if (endOfUserPos < data.length)                
            message = data.substring(endOfUserPos, endOfMessagePos);            

            pos = endOfMessagePos + 1;            
            
            let existingTweets : TUserTweets = this.usersTweetRecords[user] || [];
               
            if (message.length)            
                existingTweets.push({modstamp:modstamp++, message:message});
            
            this.usersTweetRecords[user] = existingTweets;                    
        }

        return this.usersTweetRecords;
    }
}
