const express = require('express');
const { check, body } = require('express-validator'); /* i will use both objects for diffrents validation & sanitizers procedures for the req arguments */


const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        check('password', 'Please enter password only with numbers and text and at least 5 characters.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);


router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userObj => {
                    if (userObj) {
                        return Promise.reject('E-Mail exists already, please enter a diffrent one.');
                    }
                    // return true; TODO ::: Maybe need to return true not 100% because we sanitizers afterwards...
                });
            })
            .normalizeEmail(),

        body('password', 'Please enter password only with numbers and text and at least 5 characters.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),

        body('confirmPassword', 'Passwords are not matched!')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords are not matched!');
                }
                return true;
            }),
        body('username', 'Please enter a valid username')
            .isLength({ min: 3 })
            .trim(),

        body('selector', 'Please select platform.')
            .trim()
            .custom((value, { req }) => {
                if (!value) {
                    throw new Error('You must select platform!');
                }
                return true;
            }),
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);




module.exports = router;
