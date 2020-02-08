module.exports.loginUser = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: "Login user handler"
  //   })
  // };
  // callback(null, response);

  const User = require('../models/users.js')
  const UserActivity = require('../models/userActivities.js')
  const connectToDatabase = require('./dbHandler')
  const setResponse = require('./setResponse.js')
  const reqbody = JSON.parse(event.body)

  // Check that required fields are not missing
  if (!(reqbody.email) || !(reqbody.password)) {
    return callback(null, setResponse(404, 'Required fields are missing'))
  }

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      User.findOne({email: reqbody.email})
        .then(user => {
          if (!user) {
            return callback(null, setResponse(404, 'User not found with email ' + reqbody.email))
          } else {
            if (user.validPassword(reqbody.password)) {
              if (user.verified === 'N') {
                return callback(null, setResponse(404, 'Oops...looks like this email has not been verified yet.  Please confirm the registration with the link we sent to your email you registered with!')) 
              } else {
                // log the login activity
                const newActivity = new UserActivity({
                  email: user.email,
                  userActivity: {
                    activityType: 'Login',
                    activityDesc: 'User logged into the application'
                  }
                })
                newActivity.save()
                  .then(data => {
                    return callback(null, setResponse(200, user))
                  }).catch(err => {
                    return callback(null, setResponse(500, 'Connection error: ' + err.message))
                  })
              }
            } else {
              return callback(null, setResponse(401, 'Incorrect password.  Please click on Forgot Password if you need to reset your password!'))
            }
          }
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'DB Connection error: ' + err.message))
    })
}
