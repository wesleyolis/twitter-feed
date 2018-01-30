import * as fs from 'fs';
import {DisplayTweets} from './displayTweets';

class TwitterFeed
{
    public constructor()
    {
    }

    public Run()
    {        
        if (process.argv.length < 4)   // First 2 arguments are defautly supplied by node env.
        {        
            console.log("required 2 commandline arguments, [user_file], [tweets_file]")
            console.log("Got: " + JSON.stringify(process.argv));
            process.abort();
        }
        else
        {
            console.log("Got: " + JSON.stringify(process.argv));
            this.users = process.argv[2];
            this.tweets = process.argv[3];
        }
        /*
        Doesn't seem to be working.
        fs.exists("/program.js", (exists : boolean) => {
            if (exists == false)
            {
                console.log("Testing Exists");
                process.abort();
            }
        });*/

        /*
        fs.exists(this.users, (exists : boolean) => {
            
            if (exists == false)
            {
                console.log("User file counldn't be found!");
                process.abort();
            }

            return fs.exists(this.tweets, (exists : boolean) =>
            {
                if(exists == false)
                {
                    console.log("Tweets file couldn't be found!");
                    process.abort();
                }

                new DisplayTweets(this.tweets, this.users).Display();
            });
        })*/

        new DisplayTweets(this.tweets, this.users).Display();

        /*process.argv.forEach((val, index) => {
            console.log(`${index}: ${val}`);
        });        */
    }

    private DisplayTweets()
    {

    }

    private users : string;
    private tweets: string;
}

new TwitterFeed().Run();
