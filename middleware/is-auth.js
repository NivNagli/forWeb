/* Will use that middleware later for register user action only, like create squad, delete squad, and more... */
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}