const path = require('path')
const renderer = require('./renderer')
const assetLoader = require('./assetLoader')
const twipsumFetcher = require('./twipsumFetcher')

function redirectToHTTPS(req, res) {
  if (!res.finished) {
    var env = process.env.NODE_ENV || 'dev'
    if (req.headers['x-forwarded-proto'] != 'https' && env != 'dev') {
      res.writeHead(302, {'Location': 'https://twipsum.net' + req.url})
      res.end()
    }
  }
}

function home(req, res) {
  if (!res.finished && req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    renderer.view('_header', {}, res)
    renderer.view('_intro', {}, res)
    renderer.view('_generator', {}, res)
    renderer.view('_footer', {}, res)
    res.end()
  }
}

function asset(req, res) {
  if (!res.finished) {
    var ext = path.extname(req.url)
    switch(ext) {
      case '.svg':
        res.writeHead(200, {'Content-Type': 'image/svg+xml' })
        break
      case '.png':
        res.writeHead(200, {'Content-Type': 'image/png' })
        break
      case '.ico':
        res.writeHead(200, {'Content-Type': 'image/x-icon' })
        break
      case '.js':
        res.writeHead(200, {'Content-Type': 'application/js' })
        break
      case '.css':
        res.writeHead(200, {'Content-Type': 'text/css' })
        break
      case '.txt':
        res.writeHead(200, {'Content-Type': 'text/plain' })
        break
      default:
        return
    }
    assetLoader.load(req, res)
  }
}

function search(req, res, twitterAPI) {
  if (!res.finished) {
    var queryString = req.url.replace('/', '')
    if (queryString.startsWith('@')) {
      // We're only dealing with requests that have no file extensions,
      // and requests that are passing some sort of query parameters.
      // We can therefore assume that this is a search.
      if (req.method === "POST" ) {
        // Post request. Return JSON.
        res.writeHead(200, {'Content-Type': 'application/json'});
        twipsumFetcher.fetch(req, res, twitterAPI)
      } else {
        // Get request. Return HTML filled with placeholder values.
        res.writeHead(200, {'Content-Type': 'text/html'});
        renderer.view("_header", {}, res)
        renderer.view("_intro", {}, res)
        renderer.view("_generator", {}, res)
        renderer.view("_footer", {}, res)
        res.end()
      }
    }
  }
}

module.exports.redirectToHTTPS = redirectToHTTPS
module.exports.home = home
module.exports.asset = asset
module.exports.search = search
