/* This middleware will help us verify that the information the user has entered for the username and platform 
 * belongs to an existing activision user.
 */

const axios = require('axios');

exports.validActivisionUsers = async (usernames, platforms) => {

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



    console.log("Usernames and platforms that received for the 'validActivisionUsers' procedure:");
    console.log(usernames);
    console.log(platforms);
    const playersDataRequestsBarrier = []; /* The promise barrier for the search operation on the api */
    for (let i = 0; i < usernames.length; i++) {
        playersDataRequestsBarrier.push(fetchPlayerStats(usernames[i], platforms[i]));
    }
    playersStats = await Promise.all(playersDataRequestsBarrier); /* save the results thats run in parrlel */
    const apiError = errorIdentifier(playersStats, originalUsernames, originalPlatforms);

    if(apiError) {
        console.log("Registration process failed due to a failed detection of the activision user\n error message returned: " + apiError);
    }
    return apiError;
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