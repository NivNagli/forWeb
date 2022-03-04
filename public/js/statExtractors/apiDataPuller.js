
/* This script is responsible for extracting the information about the users with data who came from the server, 
 * In case we get an error while trying to extract the data about the users from our API we will make sure to redirect back 
 * to the main search page where the errors will appear,
 * Detailed documentation at the end of the file. 
 */


const evalArray = (arrayString, resultArray) => {
    /* We need this method because the information that comes from the server with the help of the ejs engine 
     * comes in the configuration of a string so we will work on it and turn it into an javascript array */

    let tempArray = arrayString.innerText.split(',');
    tempArray.forEach(name => { resultArray.push(name.replace('"', '').replace(' ', '')) });
};

const fetchPlayerStats = async (username, platform) => {
    /* A method that uses our API server and returns a "promise" that we will take care of later */
    var config = {
        method: 'get',
        url: `http://localhost:8080/extract/lastGamesStats/${platform}/${username}`,
        headers: {}
    };
    return await axios(config).catch(err => { return err; });
};

const errorIdentifier = (playersDataArray, usernamesArray, platformsArray) => {
    /* As the name sound like, this method will help us to tell the user about the specific problem in case she exists.. */
    for (let i = 0; i < playersDataArray.length; i++) {
        if (!playersDataArray[i].data) {
            if(!playersDataArray[i].response) {
                return `We have a problem with the servers, we apologize for the inconvenience. [if you are admin error message :API_S_D]`;
            }
            if (playersDataArray[i].response.status === 422) {
                return `Invalid Platform Or Username For the user : ${usernamesArray[i]}`;
            }

            else if (playersDataArray[i].response.status === 404) {
                return `The user ${usernamesArray[i]} profile is private!`;
            }
            else if (playersDataArray[i].response.status === 503) {
                return `We have a problem with the servers, we apologize for the inconvenience and recommend that you perform a search in a few minutes.`;
            }
            else {
                return `Unknown Error Please Contact Us If She Continue.`;
            }
        }
    }
    return '';
};

const buildBattleUserName = (battleName) => {
    /* Because the URI need to sent encoded i made function for that */
    splitRes = battleName.split('#');
    if(!splitRes[1]) {  // the case the user didnt enter '#', we will send error about this from the api.
        return splitRes[0] + "%2523";
    }
    console.log(splitRes[0] + "%2523" + splitRes[1]);
    return splitRes[0] + "%2523" + splitRes[1];
};

const extractPlayersData = async (usernamesInputClass, platformsInputClass) => {
    /* In order to optimize working time we will use a barrier for all our "promises" so that they can work in parallel 
     * and when they all finish we will receive our information */

    const usernames = [];
    const platforms = [];
    evalArray(document.querySelector(usernamesInputClass), usernames);
    evalArray(document.querySelector(platformsInputClass), platforms);

    const originalUsernames = usernames.slice(0);  // We will use both variables in case of error to info the user about the full name he gave us.
    const originalPlatforms = platforms.slice(0);

    platforms.forEach( (platform, index) => {
        /* Arrange the input for the api */
        if(platform === 'battle') {
            usernames[index] = buildBattleUserName(usernames[index]);
        }
        if(platform === 'xbox') {
            platforms[index] = 'xbl';
        }
    } );
    console.log("Usernames and platforms that received for the 'compare' procedure:");
    console.log(usernames);
    console.log(platforms);
    const playersDataRequestsBarrier = []; /* The promise barrier for the search operation on the api */
    for (let i = 0; i < usernames.length; i++) {
        playersDataRequestsBarrier.push(fetchPlayerStats(usernames[i], platforms[i]));
    }
    playersStats = await Promise.all(playersDataRequestsBarrier); /* save the results thats run in parallel */
    const apiError = errorIdentifier(playersStats, originalUsernames, originalPlatforms);

    if (apiError) {
        console.log("The procedure 'extractPlayersData' for the 'compare' action just failed error message:");
        console.log(apiError);
        window.location = `/compare-error-result/${apiError}`;
        return;
    }
    return playersStats;
};


/*
 * ==================== apiDataPuller.js (extractPlayersData method) ====================
 * First of all it should be understood that I transfer the usernames and platforms arrays from server side to client 
 * with the help of hidden div's, with the help of the ejs engine I put their contents in a string configuration within them.
 * Then in need to parse them with speical method i made called 'evalArary' in order to transfer them from a string object to an array,
 * Once I have the two arrays I make an attempt to pull the information from the api with the help of a promise barrier 
 * that makes sure that all requests run simultaneously and end together.
 * After all the promises have received a response from the api, a check is performed on them to check whether we received error status 
 * in one of them, and if we received an error we will be redirected back to the search page 
 * and move the content of the error to be displayed there,
 * in case we do not get an error we will return an array that will contain the general information 
 * as we get it from the api for each user.
 */

/* ========================================================================================================================================== */

/*
 * ==================== apiDataPuller.js (extractPlayersLifetimeData method) ====================
 * As shown in the documentation above, also in this method we will get the input with the help of ejs engine,
 * but this time the inputs will be not in an array configuration but in a single input configuration 
 * for each type of platform / username input.
 * After i extract the input from the user i enter the data to a arrays in order to send the request to the api as i did in the preivous
 * method above and also identifying error as i did above with the 'errorIdentifer' method that need to get arrays in her arguments.
 * 
 * In summary this method is very similar to method 'extractPlayersData' only this time we referring to the api is for another service
 * [for the player lifetime and weekly stats] and also it does not deal with multiple users but it returns information for a single user.
 * The value returned from it is an array: the first argument is JSON data that we recive from the api
 * and the second is the name of the user to which the information belongs
 */
const extractPlayersLifetimeData = async (usernamesInputClass, platformsInputClass) => {
    const tempUsername = evalSingleInput(document.querySelector(usernamesInputClass).innerText);
    const tempPlatform = evalSingleInput(document.querySelector(platformsInputClass).innerText);


    let username = [tempUsername]; // Although we get input for one user we will use the array for the other methods that are already adapted to work with arrays
    let platform = [tempPlatform];
    const originalUsername = username.slice(0);  // We will use both variables in case of error to info the user about the full name he gave us.
    const originalPlatform = platform.slice(0);


    if(platform[0] === 'battle') {  // Adjust the input to the information that the api will need to receive
        username[0] = buildBattleUserName(tempUsername);
    }
    if(platform[0] === 'xbox') {
        platform[0] = 'xbl';
    }

    console.log("Username and platform after processing for 'extractPlayersLifetimeData'");
    console.log(username);
    console.log(platform);

    const playersDataRequestsBarrier = []; /* The promise barrier for the search operation on the api */
    for (let i = 0; i < username.length; i++) { // if in the future we would like to adapt the method to use for some users 
        playersDataRequestsBarrier.push(fetchPlayerLifetimeStats(username[i], platform[i]));
    }
    playersStats = await Promise.all(playersDataRequestsBarrier); /* save the results thats run in parrlel */
    const apiError = errorIdentifier(playersStats, originalUsername, originalPlatform);
    if (apiError) {
        console.log(apiError);
        window.location = `/compare-error-result/${apiError}`;
        return;
    }
    return [playersStats, originalUsername];  // first value is the response from the api and the second one is the user name.
};

const evalSingleInput = (inputText) => {
    return inputText.replace('"', '').replace('"' , '').trim();
}

const fetchPlayerLifetimeStats = async (username, platform) => {
    /* A method that uses our API server and returns a "promise" that we will take care of later */
    var config = {
        method: 'get',
        url: `http://localhost:8080/extract/generalStats/${platform}/${username}`,
        headers: {}
    };
    return await axios(config).catch(err => { return err; });
};

