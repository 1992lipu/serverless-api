const crypto = require('crypto')

// how do I access the models?  same way as here?
const User = require('../models/users.js') 

// Register a new user
module.exports.loginUser = (event, context, callback) => {
  // Check that required fields are not missing
  const req = event.body
  var responseMsg = ''
  var response = ''

  if (!(req.password) || !(req.body.name) || !(req.body.email)) {
    response = {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Required fields are missing'
      })
    }
    callback(null, response)
    return
  }

  // Check if user with the same email already exists
  // how to access mongodb from Lambda?
  const filter = { email: req.body.email }
  User.findOne(filter)
    .then(user => {
      response = {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Required fields are missing'
        })
      }
      callback(null, response)
    }).catch(err => {
      res.status(500).send({
        message: err.message + 'Something went wrong.  Please try again in a few minutes'
      })
    })

  // Generate token to send in email
  var token = crypto.randomBytes(128).toString('hex')

  // Generate key for encryption
  var userKey = crypto.randomBytes(128).toString('hex')

  // Create the user
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    eosaccount: req.body.eosaccount,
    userKey: userKey,
    token: token,
    verified: 'N',
    contractCount: 0,
    tokenBalance: 0
  })

  // Encrypt password before saving
  newUser.setPassword(req.body.password)

  // Save user in the database
  newUser.save()
    .then(data => {
      // to add code that adds 100 tokens to the user account
      res.status(201).send({
        message: 'User signed up'
      })
    }).catch(err => {
      res.status(500).send({
        message: err.message + 'Failed to signup user'
      })
    })
}

