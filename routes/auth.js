const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();



passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(null, profile.id, profile.name.familyName, profile.name.givenName, 
        function (err, user) {
            return done(err, user);
        });
    }
));

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));


passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


/**
 * GET /auth/google
 * Use passport.authenticate() as route middleware to authenticate the
 * request.  The first step in Google authentication will involve
 * redirecting the user to google.com.  After authorization, Google
 * will redirect the user back to this application at /auth/google/callback
 */
router.get('/google', passport.authenticate('google', { 
    scope: ['profile'] 
})
);

/**
 * GET /auth/google/callback
 * Use passport.authenticate() as route middleware to authenticate the
 * request.  If authentication fails, the user will be redirected back to the
 * login page.  Otherwise, the primary route function function will be called,
 * which, in this example, will redirect the user to the home page.
 */
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/');
    }
);



/**
 * Get user's profile info.
 * Returns profile info as json or 401 in case of error.
 * Useful route to check if the user is logged in.
 */
router.get('/profile', function(req, res) {
    if(!req.isAuthenticated() || !req.user._id ) return res.status(401).send("Unauthorized");
    
    const userID = String(req.user._id);
    User.findOne({ _id: userID })
    .then( result => res.json(result) )
    .catch( error => res.status(401).send(String(error)) )
})


/**
 * Logouts current user and returns 200.
 */
router.get('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
});



module.exports = router;