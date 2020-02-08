module.exports.getUserProfile = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'User Profile Handler'
  //   })
  // };
  // callback(null, response);

  const User = require('../models/users.js')
  const setResponse = require('./setResponse.js')
  const connectToDatabase = require('./dbHandler')
  const reqbody = event.pathParameters

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      User.findOne({email: reqbody.email}).select(['-hash', '-salt', '-token'])
        .then(user => {
          if (!user) {
            return callback(null, setResponse(404, 'User not found with email: ' + reqbody.email))
          }
          return callback(null, setResponse(200, user))
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'Connection error: ' + err.message))
    })
}
