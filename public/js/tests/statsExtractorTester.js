/* This script need the according scripts: [apiDataPuller.js, player.js, statsExtractor.js],
 * I'm going to explain the working with each of the scripts at the level below,
 * and for each method that is in this script I will write documentation within the method itself.
 * 
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
 * 
 * ==================== player.js ====================
 * this file contain a Player class with a builder who receives in his argument the content of the response from the api 
 * and uses it to build an object of a player with appropriate methods documented!! there within it
 * 
 * ==================== statExtractor.js ====================
 * This script will have the methods that arrange and summarys the information from the general data we received 
 * and the methods will return us appropriate results arrays that we will test over here.
*/

const last20GamesStats = () => {
    extractPlayersData('.usernamesInput', '.platformsInput').then(playerDataJsonsArray => {
        /* the arguments are the class names of the div's who contain the players&platfrom names array's that we send with ejs engine!
        
         * This method contain in her 4 type of extraction, the first one should return for us the total stats from the last 20 games
         * the second one need to reutrn the total ranked games stats from the last 20 games,
         * the third one need to return the total stats of all the common games of the players from the last 20 games,
         * the fourth one need to return the total stats of all the common ranked games of the players from the last 20 games.
         * 
         * after the 4 arrays we print the result of sort the allGamesStats array by kills the player with most kills should be in the
         * first index.
        */
        console.log("Last 20 games stats TESTER:");
        const playersArray = buildPlayersArray(playerDataJsonsArray);
        console.log(playersArray);
        const wantedStats = [];
        for (let i = 1; i < 10; i++) {
            wantedStats.push(popularKeyStatsMap[i]);
        }
        const allGamesStats = getAllPlayersGamesStats(playersArray, wantedStats);
        const allRankedgamesStats = getAllPlayersRankedGamesStats(playersArray, wantedStats);
        const allCommonGamesStats = getAllPlayersCommonGamesStats(playersArray, wantedStats);
        const allCommonRankedGamesStats = getAllPlayersRankedCommonGamesStats(playersArray, wantedStats);
        console.log(allGamesStats);
        console.log(allRankedgamesStats);
        console.log(allCommonGamesStats);
        console.log(allCommonRankedGamesStats);
        console.log(sortStatsArray(allGamesStats, 'kills'));
    });
}



// last20GamesStats();
// displayRankedResults();
// displayAllGamesResults();

/* Until this stage this are test for the compare players service */
/* ==================================================================================================================================== */

const lifetimeStatsExtractTest = () => {
    extractPlayersLifetimeData('.usernamesInput', '.platformsInput').then(playerDataArray => {
        /* The playerDataArray contain in the first item the playerDataArray and in the second item the player name. */
        console.log("LifeTime TESTER: ");
        const playersLifetimeStats = buildPlayerLifetimeStats(playerDataArray[0], playerDataArray[1]);
        console.log(playersLifetimeStats[0]);
        // const resultDiv = document.querySelector('.players-result__main-div'); // select the result container where we will present our information eventually

        // displayPlayerLifetimeStats(playersLifetimeStats[0], resultDiv);
        // displayPlayerWeeklyStats(playersLifetimeStats[0], resultDiv);

    });
}
lifetimeStatsExtractTest();

// const displayPlayerLifetimeStats = (playerLifeTimeStatsObj, resultDiv) => {
//     if (!playerLifeTimeStatsObj.lifetimeStats['kills']) return; // the case the user didnt play warzone, extreme case.
//     const thAndtdClasses = ['nick', 'dataCell']; // i gave the first cell the 'nick' class because i want the css design of that class.
//     theadTextsArray = ['stat', ''];
//     const wantedStats = ['kills', 'deaths', 'kdRatio', 'wins', 'downs', 'gamesPlayed', 'scorePerMinute', 'revives', 'topFive', 'timePlayed'];
//     const tbodyTextsArrays = [];
//     wantedStats.forEach(stat => {
//         if (stat === 'timePlayed') { /* Mathmatical calculation for convert the time in seconds to days and hours. */
//             let timeInSec = playerLifeTimeStatsObj.lifetimeStats[stat];
//             let timeInDays = Math.floor((timeInSec / (3600 * 24)));
//             let timeInHours = Math.floor((((timeInSec / (3600 * 24)) - timeInDays) * 24));
//             timeInDays = timeInDays.toFixed(0);
//             tbodyTextsArrays.push([stat, `${timeInDays} Days ${timeInHours} Hours`]);
//         }

//         else if (stat === 'scorePerMinute' || stat === 'kdRatio') {
//             tbodyTextsArrays.push([stat, playerLifeTimeStatsObj.lifetimeStats[stat].toFixed(2)]);
//         }
//         else {
//             tbodyTextsArrays.push([stat, playerLifeTimeStatsObj.lifetimeStats[stat]]);
//         }
//     });

//     resultDiv.appendChild(buildTableView(thAndtdClasses, theadTextsArray, tbodyTextsArrays, 'Lifetime stats'));
// };

// const displayPlayerWeeklyStats = (playerLifeTimeStatsObj, resultDiv) => {
//     if(!playerLifeTimeStatsObj.allWeeklyStats) return ; // the case the player didnt play in the current weekend.
//     const wantedStats = ['kills', 'deaths', 'kdRatio', 'damageDone', 'damageTaken', 'killsPerGame', 'scorePerMinute', 'matchesPlayed', 'gulagKills', 'gulagDeaths'];
//     const thAndtdClasses = ['nick', 'dataCell']; // i gave the first cell the 'nick' class because i want the css design of that class.
//     theadTextsArray = ['Mode', ''];
//     // console.log(playerLifeTimeStatsObj.weeklyStatsPerModeArray);
//     wantedStats.forEach( (stat) => {
//         let tbodyTextsArrays = [];
//         let weeklyStatsArrayPerMode = playerLifeTimeStatsObj.weeklyStatsPerModeArray;
//         let allWeeklyStats = weeklyStatsArrayPerMode.find(statObj => statObj.mode === 'all modes');
//         if (stat === 'scorePerMinute' || stat === 'kdRatio' || stat === 'killsPerGame') {
//             tbodyTextsArrays.push(['all modes', allWeeklyStats[stat].toFixed(2)]);
//         }
//         else {
//             tbodyTextsArrays.push(['all modes', allWeeklyStats[stat]]);
//         }
//         weeklyStatsArrayPerMode = sortStatsArray(removeStatDataFromArray(weeklyStatsArrayPerMode, allWeeklyStats), stat);
//         weeklyStatsArrayPerMode.forEach(statObj => {

//             if (stat === 'scorePerMinute' || stat === 'kdRatio' || stat === 'killsPerGame') {
//                 tbodyTextsArrays.push([statObj.mode, statObj[stat].toFixed(2)]);
//             }
//             else {
//                 tbodyTextsArrays.push([statObj.mode, statObj[stat]]);
//             }
//         });
//         resultDiv.appendChild(buildTableView(thAndtdClasses, theadTextsArray, tbodyTextsArrays, 'Weekly ' + stat));
//     });

// };

// const removeStatDataFromArray = (array, stat) => {
//     let tempArray = [stat]; // putting the item in temp array because i want to include the 'incldues' method.
//     return array.filter( item => !tempArray.includes(item) );
// }




