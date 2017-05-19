function fetch(req, res, twitterAPI) {
  var queryString = req.url.replace('/', '')
  var validQuery = false
  if (queryString.startsWith('@')) {
    // We're searching for a username.
    // We only care for the username in the url and
    // can omit any further parameters that might be sent.
    // For example, http://twipsum.net/@damirkotoric?ref=somewebsite
    queryString = queryString.split('?')[0]
    twitterAPI.getTweetsByUsername(queryString, res)
    validQuery = true
  }
  if (!validQuery) {
    // We're doing a regular search, which is not supported.
    res.end()
  }
}

module.exports.fetch = fetch
