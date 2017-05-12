const http = require("http")
const router = require("./controllers/router")

// set the port of our application
// process.env.PORT lets the port be set by Heroku
// from https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku
var port = process.env.PORT || 3000

http.createServer(function (req, res) {
  router.home(req, res)
  router.search(req, res)
  router.asset(req, res)
}).listen(port)
console.log('Server running at http://localhost:3000')
