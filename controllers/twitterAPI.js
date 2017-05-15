const nconf = require('nconf')
const Twit = require('twit')
var twitConnection

nconf.file({ file: 'config.json' }).env();

function connect() {
  twitConnection = new Twit({
    // On Heroku prod we use https://devcenter.heroku.com/articles/config-vars
    // to set the same key/value pairs. Then access them using the 'process' object.
    // On local we keep the Twitter keys in a config.json file. This file never
    // gets commited to Github for security reasons. But the config_example.json
    // template does. Use this to populate the keys and get the twitter calls
    // working on local.
    consumer_key: process.env.TWITTER_CONSUMER_KEY || nconf.get('TWITTER_CONSUMER_KEY'),
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || nconf.get('TWITTER_CONSUMER_SECRET'),
    app_only_auth: true
  })
}

function getTweetsByUsername(username, res) {
  twitConnection.get('statuses/user_timeline', { screen_name: username, count: 100 }, function(err, data, response) {
    res.write(JSON.stringify(data))
    res.end()
  })
}

function getTweetsByHashtag(hashtag, res) {
  twitConnection.get('search/tweets', { q: hashtag, count: 100 }, function(err, data, response) {
    res.write(JSON.stringify(data))
    res.end()
  })
}

module.exports.connect = connect
module.exports.getTweetsByUsername = getTweetsByUsername
module.exports.getTweetsByHashtag = getTweetsByHashtag
