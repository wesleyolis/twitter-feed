import {FileDataReader} from '../DataReader/FileDataReader';
import {IDataReader} from '../DataReader/IDataReader';

export type TUser = string;
export interface TUserAndFollowers {user: TUser, follows : TUser []};
export type TUserRecordList = TUserAndFollowers [];

export class Users
{
    private usersRecords : TUserRecordList | null = null;

    constructor(private dataReader : IDataReader)
    {        
    }

    parseUserRecords() : TUserRecordList 
    {
        if (this.usersRecords !== null)
        {
            return this.usersRecords;
        }

        this.usersRecords = [];

        let data = this.dataReader.ReadAllData();
        
        // This could also probably be done by a split string method.

        // Expecting a well formed file, to reduce all the corner case processing that I don't have time for.
        // User
        // User follows
        // user 

        for (let pos = 0; pos < data.length; pos++)
        {
            let endOfUserPos = data.indexOf(" follows ", pos);                
            let endOfFollowsPos = data.indexOf("\n", endOfUserPos == -1 ? 0 : endOfUserPos);            

            if (endOfFollowsPos == -1)
                endOfFollowsPos = data.length;

            if (endOfUserPos == -1)        
                endOfUserPos = endOfFollowsPos;
            
            let user : TUser = data.substring(pos, endOfUserPos);
            let follows : TUser [] = [];
            
            endOfUserPos += 9;

            if (endOfUserPos < data.length)                
                follows = data.substring(endOfUserPos, endOfFollowsPos).split(', ');            

            pos = endOfFollowsPos;            

            this.usersRecords.push({user:user, follows:follows});
        }

        // We are assuming that user names are case sensitive.
        return this.usersRecords.sort((a,b) => a.user.localeCompare(b.user));
    }
    
}
