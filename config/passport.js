const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: keys.FacebookClientID,
        clientSecret: keys.FacebookClientSecret,
        callbackURL: '/auth/facebook/callback',
        proxy: true,
    }, (accessToken, refreshToken, profile, cb) => {
        console.log(accessToken);
        console.log(profile);
    }));
};
