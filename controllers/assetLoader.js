var fs = require("fs")

function load(req, res) {
  fs.readFile('./public' + req.url, function(error, content) {
    if (error) {
      console.error(error.message)
    } else {
      res.write(content)
      res.end()
    }
  })
}

module.exports.load = load
