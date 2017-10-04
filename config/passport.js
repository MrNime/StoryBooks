const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load User model
const User = mongoose.model('users');

module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: keys.FacebookClientID,
        clientSecret: keys.FacebookClientSecret,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'first_name', 'last_name', 'picture.type(large)', 'email'],
        proxy: true,
    }, (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile);

        const newUser = {
            facebookID: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            image: profile.photos[0].value
        };

        // Check for existing user
        User.findOne({
            facebookID: profile.id
        }).then((user) => {
            if (user) {
                // Return user
                done(null, user);
            } else {
                // Create user
                new User(newUser)
                    .save()
                    .then(user => done(null, user));
            }
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });
};
