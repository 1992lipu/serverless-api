const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Setup schema
var userSchema = mongoose.Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  email: {
    type: String,
    required: true
  },
  phone: [{
    phoneType: String,
    phoneNumber: String
  }],
  address: {
    street: String,
    street1: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  userKey: {type: String, select: false},
  eosaccount: String,
  token: String,
  sessionToken: String,
  hash: String,
  salt: String,
  verified: String,
  verifiedDate: Date,
  contractCount: Number,
  tokenBalance: Number,
  contractFolders: [ {type: String} ],
  contractTags: [ {type: String} ]
}, {
  timestamps: true
})

// setPassword methods stores the hash of a password
userSchema.methods.setPassword = function (password) {
  // create a unique salt for a particular user
  this.salt = crypto.randomBytes(16).toString('hex')

  // hash user's salt and password with 1000 iterations, 64 length and sha512 digest
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`)
}

// validPassword method checks whether the user password is correct or not
userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`)
  return this.hash === hash
}

userSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret')
}

userSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  }
}

// Export User model
module.exports = mongoose.model('User', userSchema)
