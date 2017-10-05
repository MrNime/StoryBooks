if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: process.env.MONGODB_URI,
        FacebookClientID: process.env.FACEBOOK_ID,
        FacebookClientSecret: process.env.FACEBOOK_SECRET
    };
} else {
    module.exports = {
        mongoURI: 'mongodb://nicky:nicky@ds159274.mlab.com:59274/storybooks-dev',
        FacebookClientID: '1841492005880679',
        FacebookClientSecret: '2ef4ce8cc515a4bd59b9c957d7e5c46e'
    };
}
