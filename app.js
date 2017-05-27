const http = require('http')
const router = require('./controllers/router')
const twitterAPI = require('./controllers/twitterAPI')

// set the port of our application
// process.env.PORT lets the port be set by Heroku
// from https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku
const port = process.env.PORT || 3000
twitterAPI.connect()

http.createServer(function (req, res) {
  router.redirectToHTTPS(req, res)
  router.home(req, res)
  router.asset(req, res)
  router.search(req, res, twitterAPI)
}).listen(port)
console.log('Server running at http://localhost:3000')
