const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

//.env file
require('dotenv').config();
process.on('unhandledRejection', r => console.log(r));

//Routes imports
const index = require('./routes/index');
const auth = require('./routes/auth');
const words = require('./routes/words');

//====================================================
const app = express();

// Mongoose stuff
mongoose.Promise = global.Promise;
/* mongoose.set('debug', true); */
mongoose.connect(process.env.MONGO_DB, (err) => { if(err) console.log("Connection error", err)} );

// Logging
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

// Session & Passport
app.use(require('express-session')({ 
  cookie: { 
    path: '/', 
    httpOnly: false, 
    secure: false, 
    maxAge: null 
  },
  secret: 'random string', 
  resave: true, 
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/words', (req, res, next) => {
  if(!req.isAuthenticated() || !req.user._id ) return res.status(401).send("Unauthorized");
  next();
});
app.use('/words', words);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
