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

router.get('/verify', (req, res) => {
    if (req.user) {
        console.log(req.user);
    } else {
        console.log('not authenticated');
    }
    res.send(JSON.stringify(process.env.NODE_ENV));
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;
