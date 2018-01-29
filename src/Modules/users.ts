import {FileDataReader} from './DataReader/FileDataReader';
import {IDataReader} from './DataReader/IDataReader';

export type TUser = string;
export interface TUserAndFollowers {user: TUser, follows : TUser []};
export type TUserRecordList = TUserAndFollowers [];

export class Users
{
    private usersRecords : TUserRecordList | null = null;

    public constructor(private dataReader : IDataReader)
    {        
    }

    public parseUserRecords() : TUserRecordList 
    {
        if (this.usersRecords !== null)
        {
            return this.usersRecords;
        }

        this.usersRecords = [];

        let data = this.dataReader.ReadAllData();
        
        // This could also probably be done by a split string method.

        // Expecting a well formed file, to reduce all the corner case processing that I don't have time for.
        // I did attempt to be cleaver and add too many test cases, just makes handing of things additional complex.
        // so just removed it all data should be well formed and terminate on end of new line if at fault.
        // User
        // User follows
        // user 

        for (let pos = 0; pos < data.length; pos++)
        {
            // Establish all the boundy points first.
            let endOfUserPos = data.indexOf(" follows ", pos);                
            let endOfFollowsPos = data.indexOf("\r\n", endOfUserPos == -1 ? pos : endOfUserPos);            

            // Fix all the found points incase their were not found.
            if (endOfFollowsPos == -1)
                endOfFollowsPos = data.length;


            // One could also just skip here.
            if (endOfUserPos == -1)        
                endOfUserPos = endOfFollowsPos;
            
            let user : TUser = data.substring(pos, endOfUserPos);
            let follows : TUser [] = [];

            let followsStr : string = data.substring(endOfUserPos + 9, endOfFollowsPos);

            if (followsStr != "")
                follows = followsStr.split(', ');                        

            pos = endOfFollowsPos + 1;            

            this.usersRecords.push({user:user, follows:follows});
        }

        // We are assuming that user names are case sensitive.
        // since everything is a referance, we can produce a new list, with out much memory overhead.
        // To think of it property of dictionary back in javascript is very optimal, since follows would be a list.
        // At least we don't have to get the keys for the dictionary when needing to display.
        // we produce a new list here using for each to amagamate the records.
        // That as in my original toughts, both userRecords and followers will have duplicates.
        // Let write a generic process iterator, with this insight for speed.
        // yes this will destory the encapsulatoin knowlagde how ever and mean their need to have intrinsict knowlagde of the 
        // data structures.
        // Mabye we want to presever the duplicates for some arbitary unknow reason.
        // Then it would be better to just write a formmatting class.
        this.usersRecords = this.usersRecords.sort((a,b) => a.user.localeCompare(b.user));

        return this.usersRecords;
    }
    
}
