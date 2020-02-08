module.exports.resetPassword = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Reset Password Handler'
  //   })
  // };
  // callback(null, response);

  const User = require('../models/users.js')
  const UserActivity = require('../models/userActivities.js')
  const setResponse = require('./setResponse.js')
  const connectToDatabase = require('./dbHandler')
  const reqbody = JSON.parse(event.body)

  context.callbackWaitsForEmptyEventLoop = false

  if (!(reqbody.email)) {
    return callback(null, setResponse(404, 'Required fields are missing'))
  }

  connectToDatabase()
    .then(() => {
      // query user
      const filter = { email: reqbody.email }
      const { oldPassword, newPassword, pwdToken } = reqbody
      var resetFrom

      User.findOne(filter)
        .then(user => {
          if (!user) {
            return callback(null, setResponse(404, 'Could not find user with email' + reqbody.email))
          }

          // Check if old password is passed
          if (oldPassword) {
            // Reset password request came from user profile.  Check if old password is correct
            resetFrom = 'Reset Password'
            if (!(user.validPassword(oldPassword))) {
              return callback(null, setResponse(404, 'Old password does not match'))
            }
          } else {
            // Reset password request came from Forgot password page.  Check token
            resetFrom = 'Forgot Password'
            if (pwdToken !== user.token) {
              return callback(null, setResponse(404, 'Bad token'))
            }
          }

          // Get new password
          user.setPassword(newPassword)
          const update = { salt: user.salt, hash: user.hash, token: '' }

          User.findOneAndUpdate(filter, update, {new: true})
            .then(user => {
              // log the login activity
              const newActivity = new UserActivity({
                email: user.email,
                userActivity: {
                  activityType: 'Reset Password',
                  activityDesc: 'User reset password using: ' + resetFrom
                }
              })
              newActivity.save()
                .then(data => {
                  return callback(null, setResponse(201, 'Updated password'))
                }).catch(err => {
                  return callback(null, setResponse(500, 'Connection error: ' + err.message))
                })
            }).catch(err => {
              return callback(null, setResponse(500, 'Password update failed' + err.message))
            })
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'DB Connection error: ' + err.message))
    })
}
