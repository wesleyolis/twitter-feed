# twitter-feed
Simulation of twitter feed...

##Installation
1. Ensure that the latest nodejs is install, this was developer with versions 8.9.4
2. Ensure that npm package manager is installed. run the following on the command line "nodejs install npm"
3. Ensure that TypeScript is install, run the following on the command line "node install typescript -g"
4. Then run npm install, which should ensure that all depedancies and libaries are download and installed.

##Building Running
1. First step to compile the application, run the following command "npm run build"
2. To run the application use the following command "npm run run"

Note* To customize the start files edit the command found in package.json -> scripts:run

##Running Tests
1. Run the following command "npm run test", which will compile and run each test unit file, which end in the suffix .spec.

###Test Output, for validation:

 √ file not found

  √ file found and reads sucessfully


  Modules Tweets

    √ Should return empty list of tweets

    √ Should return a dictionary, with a single user key, that contains a list of tweets.

    √ corner case two users with no tweets, must not cause infinit loop

    √ should return a dictionary, with two user keys contain 3 tweets each

    √ parseUserRecords, should return cached records on second request

    √ test correct passing using a file DataReader

    A single user list of tweets

      √ DataReader : [Alan]

      √ DataReader : [Alan>]

      √ DataReader : [Alan> \r\n]


  Modules Users

    √ Should Return empty list of users

    √ Should return a list of a user and two followers

    √ Should return a list of two user and two followers

    √ parseUserRecords, should return cached records on second request

    √ test correct passing using a file DataReader

    Should a single user list with no followers

      √ DataReader : [Alan]

      √ DataReader : [Alan follows]

      √ DataReader : [Alan follows \r\n]



  19 passing (51ms)
