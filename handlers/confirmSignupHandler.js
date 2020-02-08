module.exports.confirmSignup = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Confirm Signup Handler'
  //   })
  // };
  // return callback(null, response)

  // import db connection
  const connectToDatabase = require('./dbHandler')

  // import user model
  const User = require('../models/users.js')
  const setResponse = require('./setResponse.js')

  const reqbody = JSON.parse(event.body)

  context.callbackWaitsForEmptyEventLoop = false

  // Check that required fields are not missing
  if (!(reqbody.email) || !(reqbody.token)) {
    return callback(null, setResponse(404, 'Required fields are missing'))
  }

  // Check if email exists with the same token
  // Check db connection
  connectToDatabase()
    .then(() => {
      const filter = { email: reqbody.email, token: reqbody.token }
      const update = { token: '', verified: 'Y', verifiedDate: Date.now() }

      User.findOne(filter)
        .then(user => {
          if (!user) {
            return callback(null, setResponse(404, 'User not found with this email and token' + reqbody.email))
          } else {
            if (user.verified === 'Y') {
              return callback(null, setResponse(404, 'Email already verified. Please login with your credentials'))
            }
            // Update verified flag in the database
            User.findOneAndUpdate(filter, update, {new: true})
              .then(user => {
                return callback(null, setResponse(201, 'User verified'))
              }).catch(err => {
                return callback(null, setResponse(500, 'Connection error: ' + err.message))
              })
          }
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    })
}
