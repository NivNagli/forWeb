const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator'); /* i will use both objects for diffrents validation & sanitizers procedures for the req arguments */
const isAuth = require('../middleware/is-auth'); // will use that custom middleware to make sure that the spesefic function for
    // singed in users are made from a user that is logged in to the site, in case the user is not logged in we wiil redirect him to the login page.

const appController = require('../controllers/app');

router.get('/', appController.getIndex);

router.post('/compare/:inputParams',
[
check('username')
.custom( (usersArray, { req }) => {
    // console.log(req.body);
    if(!usersArray) {  // The 'check' method on the username param need to return for us all the usernames from the user input.
        // console.log(usersArray);
        return Promise.reject('You must select the number of players and then fill out the form');
    }
    for(let i = 0 ; i < usersArray.length ; i ++ ) {
        if(usersArray[i] === '') {
            return Promise.reject(`You must register a username, and you did not do so for user number ${(i + 1).toString()}.`);
        }
        if(usersArray[i].length < 3) {
            return Promise.reject(`Username must contain at least 3 characters, and you did not do so for: ${usersArray[i]}.`);
        }
        let platformSelector = `selector${i}`;
        if(!req.body[platformSelector]) {
            return Promise.reject(`You must chose platform!, You have not selected a platform for: ${usersArray[i]}.`);
        }
    }
    return true;
})
],
appController.postCompare);

router.get('/player-search', appController.getPlayerSearch);

router.post('/player-search/:inputParam', 
[
    check('username')
    .custom((username, { req }) => {
        if(!username) {
            return Promise.reject(`You must enter the platform username!`);
        }
        if(username.trim().length < 3) {
            return Promise.reject(`Username must contain at least 3 characters and "${username}" not contain 3 characters...`);
        }
        if(!req.body['selector']) {
            return Promise.reject("You must select a platform!");
        }
        return true;
    })
], 
appController.postPlayerSearch);

router.get('/compare-error-result/:errorStatus', appController.displayErrorResult);

router.get('/profile-search', isAuth, appController.getSignedUserProfile);

router.get('/support', appController.getSupport);

router.get('/terms', appController.getTerms);

module.exports = router;
