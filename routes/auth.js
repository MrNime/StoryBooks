const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get(
    '/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    }
);

module.exports = router;
