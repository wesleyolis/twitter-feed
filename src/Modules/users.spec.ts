import { Users } from './users';
import { IDataReader } from '../DataReader/IDataReader';
import { MochDataReader } from '../DataReader/MochDataReader.spec'
import { expect } from 'chai';
import 'mocha';



function createNewUsersModule(data : string)
{
    return new Users(new MochDataReader(data));
}

describe('Modules Users', () => {

  it('Should Return empty list of users', () => {
    
    let records = createNewUsersModule("").parseUserRecords();
    expect(records.length).to.eq(0,"0 Records");    
  });

  it('Should a single user list with no followers', () => {
    
    let records = createNewUsersModule("Alan").parseUserRecords(); ;

    let validate = () =>
    {
        expect(records.length).to.eq(1, "Records");    
        let user = records[0];
        expect(user.user).to.eq("Alan");
        expect(user.follows.length).to.eq(0, "0 Followers to be found");
    };
     
    it("DataReader : [Alan]", () =>
    {
        validate();
    });
    
    records = createNewUsersModule("Alan follows").parseUserRecords(); ;

    it("DataReader : [Alan follows]", () =>
    {
        validate();
    });

    records = createNewUsersModule("Alan follows\n").parseUserRecords(); ;
    
    it("DataReader : [Alan follows\\n]", () =>
    {
        validate();
    });

    records = createNewUsersModule("Alan follows \n").parseUserRecords(); ;
    
    it("DataReader : [Alan follows \\n]", () =>
    {
        validate();
    });    
  });

  it('Should return a list of users', () => {
    
    let records = createNewUsersModule("Alan follows Dan").parseUserRecords();

    let validate = () =>
    {        
        expect(records.length).to.eq(1, "Records");    
        let user = records[0];
        expect(user.user).to.eq("Alan");
        expect(user.follows.length).to.eq(1, "1 Followers to be found");
    };

    validate();
    
    records = createNewUsersModule("Alan follows Dan,").parseUserRecords();

    validate();
    
    records = createNewUsersModule("Alan follows Dan, ").parseUserRecords();
    
    {
        expect(records.length).to.eq(1, "Records");    
        let user = records[0];
        expect(user.user).to.eq("Alan");
        expect(user.follows.length).to.eq(2, "2 Followers to be found");
    }

  });
  

  
  it('Should Return a list of a user and two followers', () => {
    
    let records = createNewUsersModule("Alan follows Dan, Bob").parseUserRecords();

    expect(records.length).to.eq(1, "Records");    
    let user = records[0];
    expect(user.user).to.eq("Alan");
    expect(user.follows.length).to.eq(2, "2 Followers to be found");        
    expect(user.follows[0]).to.eq("Dan");
    expect(user.follows[1]).to.eq("Bob");    
  });

  
  it('Should return a list of two user and two followers', () => {
    
    let records = createNewUsersModule("User2 follows User3, User 4\nAlan follows Dan, Bob").parseUserRecords();

    expect(records.length).to.eq(2, "Records");    

    // This also ensure the records sort order is retrained
    {
        let user = records[0];        
        expect(user.user).to.eq("Alan");
        expect(user.follows.length).to.eq(2, "2 Followers to be found");        
        expect(user.follows[0]).to.eq("Dan");
        expect(user.follows[1]).to.eq("Bob");                    
    }

    {
        let user = records[1];
        expect(user.user).to.eq("User2");
        expect(user.follows.length).to.eq(2, "2 Followers to be found");        
        expect(user.follows[0]).to.eq("User3");
        expect(user.follows[1]).to.eq("User 4");    
    }

  });

  it('praseUserRecords, should return cached records on second request', () => {
    
    let usersModule = createNewUsersModule("User2 follows User3, User 4\nAlan follows Dan, Bob");
    let records1 = usersModule.parseUserRecords();    
    let records2 = usersModule.parseUserRecords();    

    expect(records1).to.eq(records2);

  });

});