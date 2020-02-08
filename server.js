// import Express
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// initialize express app
const app = express();

// Setup server port
var port = process.env.PORT || 8080;

// Configure bodyparser to handle post requests
// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Configuring the database
const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;
const options = {
  useNewUrlParser: true,
  useFindAndModify: false
}

// Connecting to the database
mongoose.connect(dbConfig.url, options).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
   console.log('Could not connect to the database. Exiting now...', err);
   process.exit();
});

// define default route
//app.get('/', (req, res) => {
  // res.sendStatus(403);
//});

app.get('/:name?', function(req, res) {
    var url = req.url;
    switch(url){
        case "/":
            res.send('At home page');
            break;
        case "/login":
            res.send('At Login page');
            break;
        case "/signup":
            res.send('At SignUp page');
            break;
        default:
            res.sendStatus(403);
    }
    
});


// Require API routes
var apiUserRoutes = require('./app/routes/user.routes.js');
app.use('/api/v1/users', apiUserRoutes)

app.all('*', function(req, res) {
    res
    .status(403)
    .send("We are at Error Page");
  });

// listen for requests
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});