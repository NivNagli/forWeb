

class Player {
    /* 
    This sub-class will get the JSON that came back from our api that contains information about a specific user 
    And with the help of the class methods we can extract the information from the JSON data easily.
    */
   
    constructor(playerData) {
        this.playerData = playerData;
        this.playerName = playerData.data.gamesArray[0].player.username;
        this.lastGames = playerData.data.gamesArray;
        this.lastGamesSummary = playerData.data.summaryStats;
    }

    /* Methods For General Stats [Not have to be 'ranked' games (solo/duos,trios,quad)] */

    getAllGamesId() { /* return array with the last 20 games id's of the player */
        const gameIdArray = [];
        this.lastGames.forEach(game => {
            gameIdArray.push(game.matchID);
        });
        return gameIdArray;
    }

    static getAllCommonGamesId(...players) { /* return array with all the common games id's of the player */
        const playersGamesArray = [];
        players.forEach(player => playersGamesArray.push(player.getAllGamesId()));

        return playersGamesArray.reduce((a, b) => a.filter(c => b.includes(c)));
    }

    getLastGamesStatsArray() { /* return array which every object in him holds general stats on a game from the player last 20 games */
        let res = [];
        this.lastGames.forEach(game => {
            res.push(game.playerStats);
        });
        return res;
    }

    getLastGamesTotalStats(...wantedStatsList) {
        /* Returns an object that contains the sum of each stats we asked to search for */
        const avgStatList = ['scorePerMinute', 'distanceTraveled', 'percentTimeMoving'];  // stats that we want their average
        const totalStats = {};
        const lastGamesArrayStats = this.getLastGamesStatsArray();
        wantedStatsList.forEach(stat => {
            /* alculates the sum of the data in all objects */
            let totalStat = lastGamesArrayStats.reduce(function (totalByNow, gameStats) {
                return totalByNow + gameStats[stat];
            }, 0);
            /* check if that stat is average stat */
            if (avgStatList.includes(stat)) {
                totalStats[stat] = totalStat / lastGamesArrayStats.length;
            }
            else {
                totalStats[stat] = totalStat;
            }

        });
        totalStats['playerName'] = this.playerName;
        return totalStats;
    }

    getLastGamesRankedTotalStats(...wantedStatsList) {
        const avgStatList = ['scorePerMinute', 'distanceTraveled', 'percentTimeMoving'];  // stats that we want their average
        const totalStats = {};
        const rankedGamesStatsArray = this.getGamesStatsByIdArray(this.getAllRankedGamesId());
        wantedStatsList.forEach(stat => {
            /* alculates the sum of the data in all objects */
            let totalStat = rankedGamesStatsArray.reduce(function (totalByNow, gameStats) {
                return totalByNow + gameStats[stat];
            }, 0);
            /* check if that stat is average stat */
            if (avgStatList.includes(stat)) {
                totalStats[stat] = totalStat / rankedGamesStatsArray.length;
            }
            else {
                totalStats[stat] = totalStat;
            }

        });
        totalStats['playerName'] = this.playerName;
        return totalStats;
    }

    /* ======================================================================================================================*/
    /* Methods for ranked matches and for specific games data pull */

    getGameFromLastGamesById(gameId) { /* return gameData according to the ID we received */
        let res = 0; /* if the game exists in the last 20 games of the player this will change */
        this.lastGames.forEach(game => {
            if (gameId === game.matchID) {
                res = game;
            }
        });
        return res;
    }

    getAllRankedGamesId() { /* Filter the last 20 games and return us the ID's of the ranked games */
        const gameIdArray = [];
        const rankedGameModes = ["br_brsolo", "br_brtrios", "br_brduos", "br_brquads"];
        this.lastGames.forEach(game => { // "br_brsolo" "br_brtrios" "br_brduos" "br_brquads"
            if (rankedGameModes.includes(game.mode)) {
                gameIdArray.push(game.matchID);
            }
        });
        return gameIdArray;
    }

    static getAllCommonRankedGamesId(...players) {
        /* Will find the common games that appear in all the last 20 games of the players,
         * If a particular game does not exist in the history of another player's last 20 games it will not be considered! */
        const playersGamesArray = [];
        players.forEach(player => playersGamesArray.push(player.getAllRankedGamesId()));
        return playersGamesArray.reduce((a, b) => a.filter(c => b.includes(c)));
    }

    getGamesDataFromLastGamesByIdArray(gamesIdArray) {
        /* Return array of games data according to the gamesIdArray we recived */
        let res = [];
        this.lastGames.forEach(game => {
            if (gamesIdArray.includes(game.matchID)) {
                res.push(game);
            }
        });
        return res;
    }

    getGamesStatsByIdArray(gamesIdArray) {
        /* Returns an array which each object in him contains the player's general stats for the specific game
         * If he's been in the history of the last 20 games */
        let res = [];
        this.lastGames.forEach(game => {
            if (gamesIdArray.includes(game.matchID)) {
                res.push(game.playerStats);
            }
        });
        return res;
    }

    getGamesTotalStatsByIdArray(gamesIdArray, ...wantedStatsList) {
        /* Returns an array of selected statistics [wantedStaticList] of the games that we were asked to search [gamesIdArray] */

        const avgStatList = ['scorePerMinute', 'distanceTraveled', 'percentTimeMoving'];  // stats that we want their average
        const totalStats = {};
        const gamesStatsArray = this.getGamesStatsByIdArray(gamesIdArray);

        wantedStatsList.forEach(stat => {
            /* alculates the sum of the data in all objects */
            let totalStat = gamesStatsArray.reduce(function (totalByNow, gameStats) {
                return totalByNow + gameStats[stat];
            }, 0);
            /* check if that stat is average stat */
            if (avgStatList.includes(stat)) {
                totalStats[stat] = totalStat / gamesStatsArray.length;
            }

            else {
                totalStats[stat] = totalStat;
            }

        });
        totalStats['playerName'] = this.playerName;
        return totalStats;
    }

};


/* Another sub class called 'playerLifeTimeStats' each object of this class will hold information about lifetime & weekly stats */

class playerLifeTimeStats {

    constructor(playerData, playerName) {
        this.playerData = playerData.data;
        this.playerName = playerName;
        this.lifetimeStats = playerData.data.br_lifetime_data;
        this.allWeeklyStats = playerData.data.weeklyStats.all.properties;
        this.weeklyStatsPerModeData = playerData.data.weeklyStats.mode;

        /* The case the player didnt played in this week yet */
        if (!playerData.data.weeklyStats.all.properties) {
            this.allWeeklyStats = 0;
            this.weeklyStatsPerModeData = 0;
        }
        this.weeklyStatsPerModeArray = this.getRankedGamesweeklyStatsPerModeData(); // will contain the weekly stats on the ranked game modes.

    }

    convertModeNameToPopularName(modeName) {
        /* I want to popular modes will be written as they should and not as they coming from the api */
        if (modeName === "br_brsolo") return 'solo';
        if (modeName === "br_brduos") return 'duos';
        if (modeName === "br_brtrios") return 'trios';
        if (modeName === "br_brquads") return 'quads';
        if (modeName === "br_rebirth_rbrthquad") return 'rebirth quads';
        if (modeName === "br_all") return 'all modes';
        return modeName;
    }

    getRankedGamesweeklyStatsPerModeData() {
        if (!this.weeklyStatsPerModeData) { /* The case the user did not play this week */
            return 0;
        }

        const result = [];
        Object.keys(this.weeklyStatsPerModeData).forEach(modeName => {
            this.weeklyStatsPerModeData[modeName].properties['mode'] = this.convertModeNameToPopularName(modeName);
            result.push(this.weeklyStatsPerModeData[modeName].properties);
        });

        result.forEach(statObj => {
            if (statObj[Object.keys(statObj)[0]]['deaths']) { // check we the object is empty.
                statObj[Object.keys(statObj)[0]]['kdRatio'] = parseFloat((statObj[Object.keys(statObj)[0]]['kills'] / statObj[Object.keys(statObj)[0]]['deaths']).toFixed(2));
            }
        });
        return result;
    }


}