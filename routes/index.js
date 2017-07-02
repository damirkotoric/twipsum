var express = require('express')
var router = express.Router()
var twitterAPI = require('../controllers/twitterAPI')

// Redirect traffic to https
function redirectToHTTPS(req, res, next) {
  if (!res.finished) {
    var env = process.env.NODE_ENV || 'dev'
    if (req.headers['x-forwarded-proto'] != 'https' && env != 'dev') {
      res.writeHead(302, {'Location': 'https://twipsum.net' + req.url})
      res.end()
    }
  }
  next()
}

// GET /
router.get('/', function(req, res, next) {
  return res.render('index')
})

// GET /@*
router.get('/@*', function(req, res, next) {
  return res.render('index')
})

// POST /@*
router.post('/@*', function(req, res, next) {
  var queryString = req.url.replace('/', '')
  if (queryString.startsWith('@')) {
    // We're searching for a username.
    // We only care for the username in the url and
    // can omit any further parameters that might be sent.
    // For example, http://twipsum.net/@damirkotoric?ref=somewebsite
    queryString = queryString.split('?')[0]
    twitterAPI.getTweetsByUsername(queryString, function(tweets) {
      console.log('hello' + tweets)
      res.send(tweets)
      next()
    })
  } else {
    next()
  }
})

module.exports = router
