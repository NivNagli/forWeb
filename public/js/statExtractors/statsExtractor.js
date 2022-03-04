const displayRankedResults = (statsArray) => {
    /* This method will display the user table with the data of the ranked games out of the 20 of all the players 
     * And in addition will show us the data of the shared games among them,
     
     * the method will return the response  we received from api after the processing we did for her 
     * in order to avoid repeated requests to the api 
     * The returned information contains arrays of "player" objects each object contain the statistics of the 'compared' players
     * according to the filters of the comparison [ranked games / all game modes / common games / non-common games].
     */

    if(statsArray) { /* The case we already extract the players data from the api, so we dont need to extract again. */
        const resultDiv = document.querySelector('.players-result__main-div'); // select the result container where we will present our information eventually
        allCommonRankedGamesStats = statsArray[0];
        allRankedgamesStats = statsArray[1];
        const theadTextsArray = ['', 'Gametag', 'Common Ranked Games', 'All Ranked Games'];
        buildTable(resultDiv, allCommonRankedGamesStats, theadTextsArray, allRankedgamesStats);
        return;
    }   

    /* the case we didnt extract the data from the api already and that the first time we approach it  */
    return extractPlayersData('.usernamesInput', '.platformsInput').then(playerDataJsonsArray => {
        /* First we extract the data according to the input that we got we 
         * In case we received illegal input the method 'extractPlayerData' will take care of handling the situation for us
         */
        const playersArray = buildPlayersArray(playerDataJsonsArray); // build array of Player objects
        const resultDiv = document.querySelector('.players-result__main-div'); // select the result container where we will present our information eventually
        const wantedStats = selectStatsFromMap(popularKeyStatsMap);

        /* Extract the ranked games data for each player from the input */
        const allCommonRankedGamesStats = getAllPlayersRankedCommonGamesStats(playersArray, wantedStats);
        const allRankedgamesStats = getAllPlayersRankedGamesStats(playersArray, wantedStats);

        /* I extract all gamess data also because i want to return them in the end of the method to avoid reusing the api  */
        const allCommonGamesStats = getAllPlayersCommonGamesStats(playersArray, wantedStats);
        const allGamesStats = getAllPlayersGamesStats(playersArray, wantedStats);
        const theadTextsArray = ['', 'Gametag', 'Common Ranked Games', 'All Ranked Games'];

        /* build the table and display it to the user */
        buildTable(resultDiv, allCommonRankedGamesStats, theadTextsArray, allRankedgamesStats);

        /* Return the extracted arrays to avoid re-use the api for the same request*/
        const allStatsArrays = [allCommonRankedGamesStats, allRankedgamesStats, allCommonGamesStats, allGamesStats]
        return allStatsArrays;
    });
};


const displayAllGamesResults = (statsArray) => {
    /*
     * A method very similar to the 'displayRankedResults' method
     * If you want to remember on what happens in the method, go to the documentation at the beginning of the method 'displayRankedResults'.
     * These methods are almost identical only we are working on different data this time 
     * because we do not want the data of the ranked games.
     */
    if(statsArray) {
        const resultDiv = document.querySelector('.players-result__main-div'); // select the result container where we will present our information eventually
        allCommonGamesStats = statsArray[2];
        allGamesStats = statsArray[3];
        const theadTextsArray = ['', 'Gametag', 'Common Games', 'Last 20 Games'];
        buildTable(resultDiv, allCommonGamesStats, theadTextsArray, allGamesStats);
        return;
    }


    extractPlayersData('.usernamesInput', '.platformsInput').then(playerDataJsonsArray => {
        /* First we extract the data according to the input that we got we 
         * In case we received illegal input the method 'extractPlayerData' will take care of handling the situation for us
         */
        const playersArray = buildPlayersArray(playerDataJsonsArray); // build array of Player objects
        const resultDiv = document.querySelector('.players-result__main-div'); // select the result container where we will present our information eventually
        const wantedStats = selectStatsFromMap(popularKeyStatsMap);

        /* I extract the ranked games because i want to return them in the end of the method to avoid reusing the api  */
        const allCommonRankedGamesStats = getAllPlayersRankedCommonGamesStats(playersArray, wantedStats);
        const allRankedgamesStats = getAllPlayersRankedGamesStats(playersArray, wantedStats);


        const allCommonGamesStats = getAllPlayersCommonGamesStats(playersArray, wantedStats);
        const allGamesStats = getAllPlayersGamesStats(playersArray, wantedStats);
        const theadTextsArray = ['', 'Gametag', 'Common Games', 'Last 20 Games'];

        
        buildTable(resultDiv, allCommonGamesStats, theadTextsArray, allGamesStats);

        /* Return the extracted arrays to avoid re-use the api for the same request*/
        const allStatsArrays = [allCommonRankedGamesStats, allRankedgamesStats, allCommonGamesStats, allGamesStats]
        return allStatsArrays;
    });
};

const buildPlayersArray = (playerDataJsonsArray) => {
    /* Receive json array that contain the responses from the api for each player and in case we didnt got invalid input for the players
     * usernames&platforms we will build according that response a new array that each object in him will be in type of Player class
    */
    const playersArray = [];
    playerDataJsonsArray.forEach(playerJson => {
        playersArray.push(new Player(playerJson));  // Player object from the player.js file.
    });
    return playersArray;
};

const selectStatsFromMap = (statsMap) => {
    /* help method that will help us fill in an array of stats string that we want to retrieve from the 'watnedStats' map which defined here in the file */
    const wantedStats = [];
    for (let i = 1; i < 10; i++) {
        wantedStats.push(statsMap[i]);
    }
    return wantedStats;
};

const getAllPlayersRankedGamesStats = (playersArray, wantedStatsArray) => {
    /* Receive Players array & array of strings that each one of them named according to wanted stat. 
     * the result of this method is an array which each object in him contain each player stats
     * from his ranked games! from his last 20 games. 
    */
    const result = [];
    playersArray.forEach(player => {
        result.push(player.getLastGamesRankedTotalStats(...wantedStatsArray));
    });
    if (wantedStatsArray.includes('kills') && wantedStatsArray.includes('deaths')) {
        addKdStat(result);
    }
    return result;
};

const getAllPlayersRankedCommonGamesStats = (playersArray, wantedStatsArray) => {
    /* similar method to the one above, only this time we will return the data of all the ranked! common games from the last 20 games */
    const allRankedGamesIdArray = Player.getAllCommonRankedGamesId(...playersArray);
    const result = [];

    playersArray.forEach(player => {
        result.push(player.getGamesTotalStatsByIdArray(allRankedGamesIdArray, ...wantedStatsArray));
    });

    if (wantedStatsArray.includes('kills') && wantedStatsArray.includes('deaths')) {
        addKdStat(result);
    }
    return result;
};

const getAllPlayersGamesStats = (playersArray, wantedStatsArray) => {
    /* Receive Players array & array of strings that each one of them named according to wanted stat. 
     * the result of this method is an array which each object in him contain each player stats
     * from his the last 20 games. 
    */
    const result = [];
    playersArray.forEach(player => {
        result.push(player.getLastGamesTotalStats(...wantedStatsArray));
    });
    if (wantedStatsArray.includes('kills') && wantedStatsArray.includes('deaths')) {
        addKdStat(result);
    }
    return result;
};



const getAllPlayersCommonGamesStats = (playersArray, wantedStatsArray) => {
    /* similar method to the one above, only this time we will return the data of all the common! games from the last 20 games */
    const allCommonGamesIdArray = Player.getAllCommonGamesId(...playersArray);
    const result = [];
    playersArray.forEach(player => {
        result.push(player.getGamesTotalStatsByIdArray(allCommonGamesIdArray, ...wantedStatsArray));
    });

    if (wantedStatsArray.includes('kills') && wantedStatsArray.includes('deaths')) {
        addKdStat(result);
    }
    return result;
};

const addKdStat = (resultArray) => {
    /* performs a kd calculation on each stats object in the stats result array */
    resultArray.forEach(statObj => {
        if (!statObj['kills']) {
            statObj['kd'] = 0;
        }
        else {
            statObj['kd'] = statObj['kills'] / statObj['deaths'];
        }
    });
};

const buildTable = (resultDiv, pivotGamesStatsArray, theadTextsArray, ...additionalGamesStatsArrays) => {
    /* 
     * resultDiv: the div we want the table to be built into.

     * pivotGamesStatsArray: an array of "players" that according to the ranking of the players success in each stat category
     * the display order of them in the table will be determined in the specific stat table.
    
     * theadTextsArray : an array that will contain the titles of each column in the table

     * ...additionalGamesStatsArrays: additional arrays of "players" that we would also like to present in the table, 
     * it is important to remember that these arrays are not the pivot array and therefor the presentation arrangement 
     * of the players in the table will not determine according to them.
     */
    for (const statIndex of Object.keys(keysOrderInTable)) {
        /* for loop that will be to sort the array of common ranked games each time according to a different stat */
        let stat = keysOrderInTable[statIndex];
        let tbodyTextsArrays = [];
        /*
         * #tbodyTextsArrays# : an array of arrays each array will contain information about a particular player the information for each 
         * line will come from each of the "players" arrays ['pivotGamesStatsArray' || 'additionalGamesStatsArrays'] 
         * In fact, what appears inside each of the arrays represents a row in the table.
         */
        let sortedPivotGamesStats = sortStatsArray(pivotGamesStatsArray, stat);
        let index = 1;

        for (playerStats of sortedPivotGamesStats) {
            /* for loop for each playerStats from the 'player' object and because we sorted them we will retrieve the information 
             * from each player in the order they succeeded in that category
             * #playerInfoArray#: this is subset that will be inside tbodyTextsArrays and will contain information for the player we are currently on. */
            const playerInfoArray = [index.toString()];
            playerInfoArray.push(playerStats['playerName']);

            playerInfoArray.push(getPlayerSpecificStat(sortedPivotGamesStats, playerStats['playerName'], stat));

            for (gameStat of additionalGamesStatsArrays) {
                playerInfoArray.push(getPlayerSpecificStat(gameStat, playerStats['playerName'], stat));
            }

            index++;
            tbodyTextsArrays.push(playerInfoArray);
        }
        console.log("Table stats build according this values [not including the 'thAndtdClasses']:");
        console.log(theadTextsArray);
        console.log(tbodyTextsArrays);
        console.log(stat);
        resultDiv.appendChild(buildTableView(['rank', 'nick', 'dataCell', 'dataCell', 'dataCell', 'dataCell'],
            theadTextsArray, tbodyTextsArrays, stat)
        );

    }
};

const sortStatsArray = (statsArray, statToSortBy) => {
    statsArray.sort((x, y) => {
        return parseFloat(y[statToSortBy]) - parseFloat(x[statToSortBy]);
    });
    return statsArray;
};

const getPlayerSpecificStat = (playersStatsArray, playerName, wantedStat) => {
    if ((wantedStat === 'kd') || (wantedStat === 'scorePerMinute')) {
        if (findPlayerStat(playersStatsArray, playerName)[wantedStat]) {
            return findPlayerStat(playersStatsArray, playerName)[wantedStat].toFixed(2);
        }
        return 0;
    }
    return Math.floor(findPlayerStat(playersStatsArray, playerName)[wantedStat]);
};

const findPlayerStat = (playersStatsArray, playerName) => {
    return playersStatsArray.find(statsObj =>
        statsObj['playerName'] === playerName
    );
};

const popularKeyStatsMap =
{
    1: 'kills', 2: 'deaths', 3: 'assists', 4: 'damageDone', 5: 'damageTaken',
    6: 'gulagKills', 7: 'gulagDeaths', 8: 'headshots', 9: 'scorePerMinute'
};

const keysOrderInTable =
{
    1: 'kills', 2: 'deaths', 3: 'kd', 4: 'assists', 5: 'damageTaken',
    6: 'damageDone', 7: 'gulagDeaths', 8: 'gulagKills', 9: 'headshots', 10: 'scorePerMinute'
};

/* ============================================That was the last 20 games extracts & displays ========================================= */
/* ==================================================================================================================================== */

/* Now we will build the Lifetime & Weekly stats extract & displays */

const buildPlayerLifetimeStats = (playerDataJsonsArray, playerNamesArray) => {
    /* Receive json array that contain the responses from the api for each player and in case we didnt got invalid input for the players
     * usernames&platforms we will build according that response a new array that each object in him will be in type of Player class
    */
    const playersLifetimestatsArray = [];
    playerDataJsonsArray.forEach((playerJson, index) => {
        playersLifetimestatsArray.push(new playerLifeTimeStats(playerJson, playerNamesArray[index]));
    });
    return playersLifetimestatsArray;
};

const displaySearchResult = () => {
    extractPlayersLifetimeData('.usernamesInput', '.platformsInput').then(playerDataArray => {
        /* The playerDataArray contain in the first item the playerDataArray and in the second item the player name. */
        const playersLifetimeStats = buildPlayerLifetimeStats(playerDataArray[0], playerDataArray[1]);
        const resultDiv = document.querySelector('.players-result__main-div'); // select the result container where we will present our information eventually

        displayPlayerLifetimeStats(playersLifetimeStats[0], resultDiv);
        displayPlayerWeeklyStats(playersLifetimeStats[0], resultDiv);

    });
};

const displayPlayerLifetimeStats = (playerLifeTimeStatsObj, resultDiv) => {
    /* Extracting and building a table similar to what we did in comparison section, 
     * only this time we are working on a single player and in addition we have a different type of object that holds 
     * the weekly and yearly information of the user the new player object called: 'playerLifeTimeStats' 
     * and its documentation is in player.js. 
     */
    
    if (!playerLifeTimeStatsObj.lifetimeStats['kills']) return; // the case the user didnt play warzone, extreme case.
    const thAndtdClasses = ['nick', 'dataCell']; // i gave the first cell the 'nick' class because i want the css design of that class.
    theadTextsArray = ['stat', ''];
    const searchWantedStats = ['kills', 'deaths', 'kdRatio', 'wins', 'downs', 'gamesPlayed', 'scorePerMinute', 'revives', 'topFive', 'timePlayed'];
    const tbodyTextsArrays = [];
    searchWantedStats.forEach(stat => {
        if (stat === 'timePlayed') { /* Mathmatical calculation for convert the time in seconds to days and hours. */
            let timeInSec = playerLifeTimeStatsObj.lifetimeStats[stat];
            let timeInDays = Math.floor((timeInSec / (3600 * 24)));
            let timeInHours = Math.floor((((timeInSec / (3600 * 24)) - timeInDays) * 24));
            timeInDays = timeInDays.toFixed(0);
            tbodyTextsArrays.push([stat, `${timeInDays} Days ${timeInHours} Hours`]);
        }

        else if (stat === 'scorePerMinute' || stat === 'kdRatio') {
            tbodyTextsArrays.push([stat, playerLifeTimeStatsObj.lifetimeStats[stat].toFixed(2)]);
        }
        else {
            tbodyTextsArrays.push([stat, playerLifeTimeStatsObj.lifetimeStats[stat]]);
        }
    });

    resultDiv.appendChild(buildTableView(thAndtdClasses, theadTextsArray, tbodyTextsArrays, 'Lifetime stats'));
};

const displayPlayerWeeklyStats = (playerLifeTimeStatsObj, resultDiv) => {
    if(!playerLifeTimeStatsObj.allWeeklyStats) return ; // the case the player didnt play in the current weekend.
    const searchWantedStats = ['kills', 'deaths', 'kdRatio', 'damageDone', 'damageTaken', 'killsPerGame', 'scorePerMinute', 'matchesPlayed', 'gulagKills', 'gulagDeaths'];
    const thAndtdClasses = ['nick', 'dataCell']; // i gave the first cell the 'nick' class because i want the css design of that class.
    theadTextsArray = ['Mode', ''];

    searchWantedStats.forEach( (stat) => {
        let tbodyTextsArrays = [];
        let weeklyStatsArrayPerMode = playerLifeTimeStatsObj.weeklyStatsPerModeArray;
        let allWeeklyStats = weeklyStatsArrayPerMode.find(statObj => statObj.mode === 'all modes');
        if (stat === 'scorePerMinute' || stat === 'kdRatio' || stat === 'killsPerGame') {
            tbodyTextsArrays.push(['all modes', allWeeklyStats[stat].toFixed(2)]);
        }
        else {
            tbodyTextsArrays.push(['all modes', allWeeklyStats[stat]]);
        }
        weeklyStatsArrayPerMode = sortStatsArray(removeStatDataFromArray(weeklyStatsArrayPerMode, allWeeklyStats), stat);
        weeklyStatsArrayPerMode.forEach(statObj => {

            if (stat === 'scorePerMinute' || stat === 'kdRatio' || stat === 'killsPerGame') {
                tbodyTextsArrays.push([statObj.mode, statObj[stat].toFixed(2)]);
            }
            else {
                tbodyTextsArrays.push([statObj.mode, statObj[stat]]);
            }
        });
        resultDiv.appendChild(buildTableView(thAndtdClasses, theadTextsArray, tbodyTextsArrays, 'Weekly ' + stat));
    });

};

const removeStatDataFromArray = (array, stat) => {
    let tempArray = [stat]; // putting the item in temp array because i want to include the 'incldues' method.
    return array.filter( item => !tempArray.includes(item) );
}
