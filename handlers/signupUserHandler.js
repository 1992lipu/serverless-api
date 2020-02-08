module.exports.signupUser = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'User Signup Handler'
  //   })
  // };
  // callback(null, response);

  const connectToDatabase = require('./dbHandler')

  const crypto = require('crypto')
  const User = require('../models/users.js')
  const setResponse = require('./setResponse.js')
  const reqbody = JSON.parse(event.body)

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      // Check that required fields are not missing
      if (!(reqbody.password) || !(reqbody.name) || !(reqbody.email)) {
        return callback(null, setResponse(404, 'Required fields are missing'))
      }

      // Check if user with the same email already exists
      const filter = { email: reqbody.email }
      User.findOne(filter)
        .then(user => {
          if (user) {
            return callback(null, setResponse(401, 'User already exists with this email.  Please sign up with a different email or login if you are already signed up'))
          }
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })

      // Generate token to send in email
      var token = crypto.randomBytes(32).toString('hex')

      // Generate key for encryption
      var userKey = crypto.randomBytes(128).toString('hex')

      // Create the user
      const newUser = new User({
        name: reqbody.name,
        email: reqbody.email,
        phone: reqbody.phone,
        address: reqbody.address,
        eosaccount: reqbody.eosaccount,
        userKey: userKey,
        token: token,
        verified: 'N',
        contractCount: 0,
        tokenBalance: 0
      })

      // Encrypt password before saving
      newUser.setPassword(reqbody.password)

      // Save user in the database
      newUser.save()
        .then(data => {
          // to add code to send email
          return callback(null, setResponse(201, 'User signed up'))
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'DB Connection error: ' + err.message))
    })
}
