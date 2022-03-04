const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const csrfProtection = csrf();
const flash = require('connect-flash');
// const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const User = require('./models/user');
const app = express();

/* connect the session memory into our database */
const store = new MongoDBStore({
    uri: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@warzonesquad.umpk9.mongodb.net/${process.env.MONGODB_DEFAULT_DATABASE}`,
    collection: 'sessions'
});

/* set the view-engine and also create a shortcut the 'view' folder */
app.set('view engine', 'ejs');
app.set('views', 'views');

const appRoutes = require('./routes/app');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/error');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));

/* static shortcuts for specific folder that we will use in our 'ejs' files */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

/* initialize express-session */
app.use(
    session({
        secret: `${process.env.MY_SECRET}`,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(flash());

/* main middleware that will add to every action in our server the next two fields */
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


/* 
   main middleware for extracting and save the mongoose object in the req, we did that because the mongo parser will return for us
   a 'mongoDB' object and we need 'mongoose' object so we will check if the user is looged in and if he does we will save the mongoose user object
   in our session and then we can have easy access to the looged in user :D 
*/
app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => {
        next(new Error(err));
      });
  });


app.use(appRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
  /* 'Super-catcher' for unknown errors */
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

/* connect our mongoose database to the server */
mongoose
  .connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@warzonesquad.umpk9.mongodb.net/${process.env.MONGODB_DEFAULT_DATABASE}`)
  .then(result => {
    app.listen(process.env.PORT || 8081);
  })
  .catch(err => {
    console.log(err);
  });

