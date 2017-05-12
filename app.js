const http = require("http")
const router = require("./controllers/router")

http.createServer(function (req, res) {
  router.home(req, res)
  router.search(req, res)
  router.asset(req, res)
}).listen(3000)
console.log('Server running at http://localhost:3000')
