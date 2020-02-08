const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird
mongoose.Promise = global.Promise

const dbURI = require('../config/database.config.js').mongoURI

module.exports.statusCheck = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'pong',
        }),
      };
      callback(null, response);
      return;
  };

  module.exports.dbHealth = (event, context, callback) => {
    let isConnected
    
    const options = {
      useNewUrlParser: true,
      useFindAndModify: false
    }
    
    mongoose.connect(dbURI, options)
    .then(db => {
      isConnected = db.connections[0].readyState
    })
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: isConnected,
      }),
    };
    callback(null, response);
    return;
  };