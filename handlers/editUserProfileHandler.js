module.exports.editUserProfile = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Edit User Settings Handler'
  //   })
  // };
  // callback(null, response);
  // Edit user profile

  // ***Rewrite function later to make update atomic using findOneAndUpdate
  const User = require('../models/URLSearchParams.js')
  const UserActivity = require('../models/userActivities.js')
  const connectToDatabase = require('./dbHandler')
  const setResponse = require('./setResponse.js')
  const reqbody = JSON.parse(event.body)

  // Check that required fields are not missing
  if (!(reqbody.email)) {
    return callback(null, setResponse(404, 'Required fields are missing'))
  }

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      // query user
      const filter = { email: reqbody.email }

      User.findOne(filter)
        .then(user => {
          if (!user) {
            return callback(null, setResponse(404, 'Could not find user with email: ' + reqbody.email))
          }

          // Get updated user information
          if (reqbody.name) user.name = reqbody.name
          if (reqbody.phone) user.phone = reqbody.phone
          if (reqbody.address) user.address = reqbody.address

          // Save user in the database
          user.save()
            .then(data => {
              // log user activity
              const newActivity = new UserActivity({
                email: reqbody.email,
                userActivity: {
                  activityType: 'Edit Profile',
                  activityDesc: 'You edited user profile'
                }
              })
              newActivity.save()
                .then(activityData => {
                  return callback(null, setResponse(201, 'Updated user details'))
                }).catch(err => {
                  return callback(null, setResponse(500, 'Connection error: ' + err.message))
                })
            }).catch(err => {
              return callback(null, setResponse(500, 'Connection: ' + err.message))
            })
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'DB Connection error: ' + err.message))
    })
}
