const path = require('path')
const renderer = require('./renderer')
const assetLoader = require('./assetLoader')
const twipsumFetcher = require('./twipsumFetcher')

function asset(req, res) {
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
    default:
      return
  }
  assetLoader.load(req, res)
}

function home(req, res) {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    renderer.view('_header', {}, res)
    renderer.view('_intro', {}, res)
    renderer.view('_generator', {}, res)
    renderer.view('_footer', {}, res)
    res.end()
  }
}

function search(req, res, twitterAPI) {
  var queryString = req.url.replace('/', '')
  if(!path.extname(req.url) && queryString.length > 0) {
    // We're only dealing with requests that have no file extensions,
    // and requests that are passing some sort of query parameters.
    // We can therefore assume that this is a search.
    // if (req.method === "POST" ) {
      // Post request. Return JSON.
      res.writeHead(200, {'Content-Type': 'application/json'});
      twipsumFetcher.fetch(req, res, twitterAPI)
    // } else {
    //   // Get request. Return HTML filled with placeholder values.
    //   res.writeHead(200, {'Content-Type': 'text/html'});
    //   renderer.view("_header", {}, res)
    //   renderer.view("_intro", {}, res)
    //   renderer.view("_generator", {}, res)
    //   renderer.view("_footer", {}, res)
    //   res.end()
    // }
  }
}

module.exports.home = home
module.exports.search = search
module.exports.asset = asset
