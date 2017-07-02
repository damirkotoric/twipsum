const express = require('express')
// const bodyParser = require('body-parser')
const app = express()
const twitterAPI = require('./controllers/twitterAPI')

// parse incoming requests
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

// serve static files from /public
app.use(express.static(__dirname + '/public'))

// set the port of our application
// process.env.PORT lets the port be set by Heroku
// from https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku
const port = process.env.PORT || 3000
twitterAPI.connect()

// view engine setup
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

// include routes
var routes = require('./routes/index')
app.use('/', routes)

// listen on port 3000
app.listen(port, function () {
  console.log('Express app listening on port 3000')
});
