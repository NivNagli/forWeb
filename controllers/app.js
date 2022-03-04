
const path = require('path');
const { validationResult } = require('express-validator');
let axios = require('axios');


exports.getIndex = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('app/index', {
        pageTitle: "WarzoneSquad",
        path: '/',
        errorMessage: message,
        validationErrors : []
    });
};

exports.postCompare = async (req, res, next) => {

    /* Initial error detection and handling in case there are any. */
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log('Invalid input in "postCompare method" ');
        console.log(errors.array());
        return res.status(422).render('app/index', {
            pageTitle : 'WarzoneSquad',
            path : '/',
            errorMessage : errors.array()[0].msg,
            validationErrors : errors.array()
        })
    }
    /* Pull the users data from the compare html form */
    const usernames = req.body.username;
    const platforms = [];
    for(let i = 0 ; i < usernames.length ; i++) {
        let platformSelector = `selector${i}`;
        platforms.push(req.body[platformSelector]);
    }

    /* Render to the view that will display the data, we pass the general data about the users in the args over here. */
    res.render('app/compareResult', {
        pageTitle: "WarzoneSquad",
        path: '/compare',
        usernames : usernames,
        platforms : platforms
    });    
};

exports.getPlayerSearch = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('app/playerSearch', {
        pageTitle : 'Player Search',
        path : '/player-search',
        errorMessage : message,
        validationErrors : []
    });
};

exports.postPlayerSearch = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        console.log('Invalid input in "postCompare method" ');
        console.log(errors.array());
        return res.status(422).render('app/playerSearch', {
            pageTitle : 'Player Search',
            path : '/player-search',
            errorMessage : errors.array()[0].msg,
            validationErrors : errors.array()
        })
    }    

    const username = req.body.username;
    const platform = req.body['selector'];
    console.log(username);
    console.log(platform);  

    res.render('app/playerSearchResult', {
        pageTitle : 'Player Stats',
        path : '/player-search',
        username : username,
        platform : platform
    });
};

exports.displayErrorResult = (req, res, next) => {
    /* This controller will activate from our client side in case we detected an error */
    errorMessage = req.params.errorStatus;
    return res.status(422).render('app/index', {
        pageTitle : 'WarzoneSquad',
        path : '/',
        errorMessage : errorMessage,
        validationErrors : []
    });
};

exports.getSignedUserProfile = (req, res, next) => {
    res.render('app/playerSearchResult', {
        pageTitle : 'Player Stats',
        path : '/profile-search',
        username : req.user.username,
        platform : req.user.platform
    });
};

exports.getSupport = (req, res, next) => {
    res.render('includes/support', {
        pageTitle : 'Support',
        path : '/support'
    });
};

exports.getSupport = (req, res, next) => {
    res.render('includes/support', {
        pageTitle : 'Support',
        path : '/support'
    });
};

exports.getTerms = (req, res, next) => {
    res.render('includes/terms', {
        pageTitle : 'Terms Of Use',
        path : '/terms'
    });
};

/* =======================================      Help functions     ==============================================================*/
