const path = require("path")
const renderer = require("./renderer")
const assetLoader = require("./assetLoader")

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
      console.log(req.url)
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
  assetLoader.load(res, req.url)
}

function home(req, res) {
  if (req.url === "/") {
    res.writeHead(200, {'Content-Type': 'text/html'});
    renderer.view("_header", {}, res)
    renderer.view("_intro", {}, res)
    renderer.view("_generator", {}, res)
    renderer.view("_footer", {}, res)
    res.end()
  }
}

function search(req, res) {
  var queryString = req.url.replace("/", "")
  if (queryString.length > 0 && (queryString.startsWith("@") || queryString.startsWith("#"))) {
    // We're searching for either a username or hashtag
    // console.log('search ' + queryString)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end()
  }
}

module.exports.home = home
module.exports.search = search
module.exports.asset = asset
