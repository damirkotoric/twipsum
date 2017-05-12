var fs = require("fs")

function load(res, url) {
  // console.log(url)
  fs.readFile('./public' + url, function(error, content) {
    if (error) {
      console.error(error.message)
    } else {
      res.write(content)
      res.end()
    }
  })
}

module.exports.load = load
