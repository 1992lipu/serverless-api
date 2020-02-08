const mongoose = require('mongoose');
const crypto = require('crypto');

// Setup schema
var contractSchema = mongoose.Schema({
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    email: {
        type: String,
        required: true
    },
    phone: [{
        type: String,
        number: String
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
    token: String,
    hash: String,
    salt: String,
    verified: String,
    verifiedDate: Date
}, {
    timestamps: true
});

// setPassword methods stores the hash of a password
userSchema.methods.setFileHash = function(password) { 
     
    // create a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex'); 
     
    // hash user's salt and password with 1000 iterations, 64 length and sha512 digest 
    this.hash = crypto.pbkdf2Sync(password, this.salt,  1000, 64, `sha512`).toString(`hex`); 
};

// Export Contact model
module.exports = mongoose.model('User', userSchema);
