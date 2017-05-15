function fetch(req, res, twitterAPI) {
  var queryString = req.url.replace('/', '')
  var validQuery = false
  if (queryString.startsWith('@')) {
    // We're searching for a username
    twitterAPI.getTweetsByUsername(queryString, res)
    validQuery = true
  }
  if (queryString.startsWith('hashtag/')) {
    // We're searching for a hashtag
    twitterAPI.getTweetsByHashtag(queryString.replace('hashtag/', '#'), res)
    validQuery = true
  }
  // We're doing a regular search, which is not supported.
  if (!validQuery) {
    res.end()
  }
}

module.exports.fetch = fetch
