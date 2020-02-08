const mongoose = require('mongoose')
const crypto = require('crypto')

// Setup schema
var contractSchema = mongoose.Schema({
  email: { type: String, required: true },
  contractFileName: { type: String, required: true },
  contractTitle: { type: String, required: true },
  contractStatus: { type: String, default: 'Active' },
  contractDesc: String,
  contractFolder: String,
  contractTags: [ {type: String} ],
  contractDataHash: String
}, {
  timestamps: true
})

// Set SHA256 hash for file contents
contractSchema.methods.setFileHash = function (fileData) {
  // create SHA256 code for the file data
  this.contractDataHash = 'SHA256'
}

// Export Contact model
module.exports = mongoose.model('Contract', contractSchema)
