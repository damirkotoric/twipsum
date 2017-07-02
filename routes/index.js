var express = require('express')
var router = express.Router()
var twitterAPI = require('../controllers/twitterAPI')
var mid = require('../middleware')

// GET /
router.get('/', mid.redirectToHTTPS, function(req, res, next) {
  return res.render('index')
})

// GET /@*
router.get('/@*', mid.redirectToHTTPS, function(req, res, next) {
  return res.render('index')
})

// POST /@*
router.post('/@*', mid.redirectToHTTPS, function(req, res, next) {
  var queryString = req.url.replace('/', '')
  if (queryString.startsWith('@')) {
    // We're searching for a username.
    // We only care for the username in the url and
    // can omit any further parameters that might be sent.
    // For example, http://twipsum.net/@damirkotoric?ref=somewebsite
    queryString = queryString.split('?')[0]
    twitterAPI.getTweetsByUsername(queryString, function(tweets) {
      res.send(tweets)
      next()
    })
  } else {
    next()
  }
})

module.exports = router
