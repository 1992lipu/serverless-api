const mongoose = require('mongoose');

// Setup schema
var userActivitySchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    activityDate: Date
}, {
    timestamps: true
});

// Export User Activity model
module.exports = mongoose.model('UserActivity', userActivitySchema);
