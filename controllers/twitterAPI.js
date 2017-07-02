const nconf = require('nconf')
const Twit = require('twit')
var twitConnection

nconf.file({ file: 'config.json' }).env()

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

function getTweetsByUsername(username, callback) {
  var results = ''
  twitConnection.get('statuses/user_timeline', { screen_name: username, tweet_mode: 'extended', count: 100 }, function(err, data, res) {
    if (!err) {
      results = JSON.stringify(convertTwitterToTwipsumJSON(data))
      callback(results)
    }
  })
}

function convertTwitterToTwipsumJSON(twitterJSON) {
  twipsumJSON = {}
  var tweets = []
  Object.keys(twitterJSON).forEach(function (key) {
    var tweet = twitterJSON[key].full_text
    // Filter out retweets
    if (tweet.startsWith('RT')) {
      return
    }
    // Remove URLs
    tweet = tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    // Remove new line characters
    tweet = tweet.trim()
    // Add new tweet to tweets
    tweets.push({'tweet': tweet})
  })
  console.log(twitterJSON[0].user.profile_image_url_https)
  twipsumJSON['profile_image_url'] = twitterJSON[0].user.profile_image_url_https
  twipsumJSON['tweets'] = tweets
  return twipsumJSON
}

module.exports.connect = connect
module.exports.getTweetsByUsername = getTweetsByUsername
