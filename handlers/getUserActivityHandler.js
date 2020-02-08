module.exports.getUserActivity = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'User Activity Handler for email: ' + event.pathParameters.email
  //   })
  // };
  // callback(null, response);

  const UserActivity = require('../models/userActivities.js')
  const setResponse = require('./setResponse.js')
  const connectToDatabase = require('./dbHandler')
  const reqbody = event.pathParameters

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      // Get user activity data
      const filter = { email: reqbody.email }

      UserActivity.find(filter)
        .then(userActivity => {
          if ((!userActivity) || (userActivity.length === 0)) {
            return callback(null, setResponse(404, 'No activity found for user'))
          }
          return callback(null, setResponse(200, userActivity))
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'DB Connection error: ' + err.message))
    })
}
