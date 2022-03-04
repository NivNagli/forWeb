const path = require('path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const acti_verification = require('../middleware/activision_user_exists');

const User = require('../models/user');

exports.getLogin = (req, res ,next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    /* We need the empty values because without them our ejs files will break our program !! */
    res.render('auth/login', {
        pageTitle: "Login",
        path: '/login',
        errorMessage : message,
        oldInput: {
            email: '',
            password: ''
          },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    /* Check for errors that thrown from the auth route, with express-validator */
    if(!errors.isEmpty()) {
        console.log(errors.array());
        /* redirect to the signup form with the errors that occurred in order for us to alert them to the user */
        return res.status(422).render('auth/login', {
            path : '/login',
            pageTitle : 'login',
            errorMessage : errors.array()[0].msg,
            oldInput : {
                email: email,
                password: password,
                confirmPassword : req.body.confirmPassword,
                username : req.body.username
            },
            validationErrors : errors.array()
        });
    }

    User.findOne({email : email})
    .then(userObj => {
        if(!userObj) {
            /* there is no user under this email in the database*/
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password',
                oldInput: {
                    email : email,
                    password, password
                },
                validationErrors : []
            });
        }
        
        bcrypt.compare(password, userObj.password) /* Decrypts the password because she encrypted in the database */
        .then( doMatch=> { 
            /* Good case when the user enter the corret password for his account */
            if(doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = userObj;
                return req.session.save(err => {
                    if(err) {
                        console.log(err);
                    }
                    res.redirect('/');
                });
            }
            /* The user enter worng password */
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password',
                oldInput: {
                    email : email,
                    password, password
                },
                validationErrors : []
            });    
        })

        .catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    })

    
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


exports.getSignup = (req , res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/signup', {
        pageTitle : "Signup",
        path: '/signup',
        errorMessage : message,
        oldInput: {
            email: '',
            password: '',
            username : ''
          },
        validationErrors: []
    });
};

exports.postSignup = async (req, res, next) => {
    /* retreving the data from the signup form */
    const email = req.body.email;
    const password = req.body.password;

    /* Check for errors that thrown from the auth route, with express-validator */
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors.array());
        /* redirect to the signup form with the errors that occurred in order for us to alert them to the user */
        return res.status(422).render('auth/signup', {
            path : '/signup',
            pageTitle : 'Signup',
            errorMessage : errors.array()[0].msg,
            oldInput : {
                email: email,
                password: password,
                confirmPassword : req.body.confirmPassword,
                username : req.body.username
            },
            validationErrors : errors.array()
        });
    }


    /* Check if the username and platform exists in activision account,
     * Since it takes time to verify with the api we will use await which will prevent the code move forward.
     */
    let possibleErrorMessage;
    await acti_verification.validActivisionUsers([req.body.username], [req.body.selector])
    .then(resultMessage => {
        possibleErrorMessage = resultMessage;
    })
    .catch(err => {
        /* unknown error case */
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(err);
        return next(error);
    });

    if(possibleErrorMessage) {  // the case we recived error message from the api to the user activision verification.
        return res.status(422).render('auth/signup', {
            path : '/signup',
            pageTitle : 'Signup',
            errorMessage : possibleErrorMessage,
            oldInput : {
                email: email,
                password: password,
                confirmPassword : req.body.confirmPassword,
                username : req.body.username
            },
            validationErrors : []
        });
    }


    /* Try to create a new user */
    bcrypt.hash(password, 12) /* Encrypts the password so that it is not exposed in a database */
    .then(hashPassword => {
        const user = new User({
            email : email,
            password: hashPassword,
            username: req.body.username,
            platform: req.body.selector
        });
        return user.save(); // make sure we dont move forward until the user saved in out data base 
    })
    .then(result => { /* now we know the user as been saved into the data base and we can redirect to the login page */
        res.redirect('/login');
    })
    .catch(err => {
        /* unknown error case */
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(err);
        return next(error);
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
  };
