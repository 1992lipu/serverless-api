const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird
mongoose.Promise = global.Promise

// Get database connection url
const dbURI = require('../config/database.config.js').mongoCloudUri
console.log(dbURI)

// Only reconnect if needed. State is saved and outlives a handler invocation 
let isConnected

const connectToDatabase = () => {
  if (isConnected) {
    console.log('Re-using existing database connection');
    return Promise.resolve()
  }

  console.log('Creating new database connection')
  const options = {
    useNewUrlParser: true,
    useFindAndModify: false
  }
  return mongoose.connect(dbURI, options)
    .then(db => {
      isConnected = db.connections[0].readyState
      // console.log(isConnected)
    })
}

module.exports = connectToDatabase
