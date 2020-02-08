const mongoose = require('mongoose')

// Setup schema
var transactionSchema = mongoose.Schema({
  email: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now },
  transcationId: String,
  transactionType: String,
  transactionDesc: String,
  tokensUsed: Number
})

// Export Folder model
module.exports = mongoose.model('Transaction', transactionSchema);