const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const { ensureAuthenticated } = require('../helpers/auth');

// Stories index
router.get('/', (req, res) => {
    Story.find({ status: 'public' })
        .populate('user')
        .sort({ date: 'desc' })
        .then((stories) => {
            res.render('stories/index', {
                stories,
                css: ['storyList.css']
            });
        });
});

// Show single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .populate('user')
        .populate('comments.commentUser')
        .then((story) => {
            if (story.status === 'public') {
                res.render('stories/show', {
                    story
                });
            } else {
                req.user.id === story.user._id.toString() ?
                    res.render('stories/show', { story })
                    :
                    res.redirect('/stories');
            }
        });
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
    Story.find({
        user: req.params.userId,
        status: 'public'
    })
        .populate('user')
        .then((stories) => {
            res.render('stories/index', {
                stories,
                css: ['storyList.css']
            });
        });
});

// Logged in users stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
        user: req.user.id
    })
        .populate('user')
        .then((stories) => {
            res.render('stories/index', {
                stories,
                css: ['storyList.css']
            });
        });
});

// Add Story form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then((story) => {
            if (story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                res.render('stories/edit', {
                    story
                });
            }
        });
});

// Process add Story
router.post('/', (req, res) => {
    const allowComments = req.body.allowComments !== undefined;

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments,
        user: req.user.id
    };

    // Create story
    new Story(newStory)
        .save()
        .then((story) => {
            res.redirect(`/stories/show/${story.id}`);
        });
});

// Edit form process
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then((story) => {
            const allowComments = req.body.allowComments !== undefined;

            // New values
            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = allowComments;

            story.save()
                .then(newStory => res.redirect('/dashboard'));
        });
});

// Delete story
router.delete('/:id', (req, res) => {
    Story.remove({ _id: req.params.id })
        .then(() => res.redirect('/dashboard'));
});

// Add comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then((story) => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            };

            // Add to comments array
            story.comments.unshift(newComment);

            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`)
                });
        });
});

module.exports = router;
