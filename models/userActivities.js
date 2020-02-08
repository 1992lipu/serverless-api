const mongoose = require('mongoose')

// Setup schema
var userActivitySchema = mongoose.Schema({
  email: { type: String, required: true },
  userActivity: {
    activityDate: { type: Date, default: Date.now },
    activityType: String,
    activityDesc: String
  }
})

// Export User Activity model
module.exports = mongoose.model('UserActivity', userActivitySchema)
