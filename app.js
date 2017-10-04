const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


// Load User Model
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth');

// Load keys
const keys = require('./config/keys');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(keys.mongoURI, { useMongoClient: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();

app.get('/', (req, res) => {
    res.send('HOME');
});

// middleware
app.use(cookieParser());

app.use(session({
    secret: 'damaaktnietuit',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
