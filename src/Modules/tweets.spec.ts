import { Tweets, TUserTweet, TUsersTweets } from './tweets';
import { IDataReader } from './DataReader/IDataReader';
import { FileDataReader } from './DataReader/FileDataReader';
import { MochDataReader } from './DataReader/MochDataReader.spec';
import { expect } from 'chai';
import 'mocha';

function createNewTweetsModule(data : string)
{
    return new Tweets(new MochDataReader(data));
}

describe('Modules Tweets', () => {

    it('Should return empty list of tweets', () => {

        let records = createNewTweetsModule("").parseUserTweets();
        
        expect(Object.keys(records).length).to.eq(0,"0 user keys");    
    });

    describe('A single user list of tweets', () => {

        let validate = (records : TUsersTweets) =>
        {
            expect(Object.keys(records).length).to.eq(1, "user key");    

            let userTweets = records["Alan"];            

            expect(userTweets).not.eq(undefined);        
            expect(userTweets.length).to.eq(0);
        };
        
        it("DataReader : [Alan]", () =>
        {
            validate(createNewTweetsModule("Alan").parseUserTweets());
        });    

        it("DataReader : [Alan>]", () =>
        {            
            validate(createNewTweetsModule("Alan>").parseUserTweets());
        });    
        
        it("DataReader : [Alan> \\r\\n]", () =>
        {
            validate(createNewTweetsModule("Alan> \r\n").parseUserTweets());
        });    
    });


    it('Should return a dictionary, with a single user key, that contains a list of tweets.', () => {

        let validate = (records : TUsersTweets) =>
        {        
            expect(Object.keys(records).length).to.eq(1, "Records");    
            let userTweets = records["Alan"];
            expect(userTweets.length).to.eq(1, "1 to be found");
            expect(userTweets[0].modstamp).to.eq(0);
            expect(userTweets[0].message).to.eq("Tweet 1");
        };

        validate(createNewTweetsModule("Alan> Tweet 1").parseUserTweets());    
    });

    it("corner case two users with no tweets, must not cause infinit loop", () =>
    {
        let usersTweets = createNewTweetsModule("Alan> AlanTweet\r\nBob").parseUserTweets();
        
        expect(Object.keys(usersTweets).length).to.eq(2);        
    });

    it('should return a dictionary, with two user keys contain 3 tweets each', () =>
    {
        let usersTweets = createNewTweetsModule("Alan> ATweet1\r\nBob> BTweet1\r\nAlan> ATweet2\r\nBob> BTweet2\r\nAlan> ATweet3\r\nBob> BTweet3\r\nNoTweet").parseUserTweets();

        expect(Object.keys(usersTweets).length).to.eq(3, "user keys");

        let alanTweets = usersTweets["Alan"];

        expect(alanTweets).not.to.eq(undefined);
        expect(alanTweets.length).to.eq(3);
        expect(alanTweets[0].modstamp).to.eq(0);
        expect(alanTweets[0].message).to.eq("ATweet1");

        expect(alanTweets[1].modstamp).to.eq(2);
        expect(alanTweets[1].message).to.eq("ATweet2");

        expect(alanTweets[2].modstamp).to.eq(4);
        expect(alanTweets[2].message).to.eq("ATweet3");

        let bobTweets = usersTweets["Bob"];
        expect(bobTweets).not.to.eq(undefined);
        expect(bobTweets.length).to.eq(3);
        expect(bobTweets[0].modstamp).to.eq(1);
        expect(bobTweets[0].message).to.eq("BTweet1");
        expect(bobTweets[1].modstamp).to.eq(3);
        expect(bobTweets[1].message).to.eq("BTweet2");
        expect(bobTweets[2].modstamp).to.eq(5);
        expect(bobTweets[2].message).to.eq("BTweet3");

        let noTweet = usersTweets["NoTweet"];
        expect(noTweet).not.to.eq(undefined);
        expect(noTweet.length).to.eq(0);
    });

    it('parseUserRecords, should return cached records on second request', () => {
        
        let usersModule = createNewTweetsModule("User2 follows User3, User 4\r\nAlan follows Dan, Bob");
        let records1 = usersModule.parseUserTweets();    
        let records2 = usersModule.parseUserTweets();    
    
        expect(records1).to.eq(records2);
      });

    it("test correct passing using a file DataReader", () =>
    {
        let fileDataReader = new FileDataReader("./src/resouces/tweet.txt");

        let userTweets = new Tweets(fileDataReader).parseUserTweets();

        expect(Object.keys(userTweets).length).to.eq(2);
        let alanTweets = userTweets['Alan'];
        expect(alanTweets).not.to.eq(undefined);
        expect(alanTweets.length).to.eq(2);
        expect(alanTweets[0].modstamp).to.eq(0);
        expect(alanTweets[0].message).to.eq("If you have a procedure with 10 parameters, you probably missed some.");
        expect(alanTweets[1].modstamp).to.eq(2);
        expect(alanTweets[1].message).to.eq("Random numbers should not be generated with a method chosen at random.");

        let wardTweets = userTweets['Ward'];
        expect(wardTweets[0].modstamp).to.eq(1);
        expect(wardTweets[0].message).to.eq("There are only two hard things in Computer Science: cache invalidation, naming things and off-by-1 errors.");
    });
});