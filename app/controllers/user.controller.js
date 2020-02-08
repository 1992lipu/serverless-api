const crypto = require('crypto');
const User = require('../models/user.model.js');


// Create and Save a new Note
exports.regsiterUser = (req, res) => {

    // Generate token to send in email
    token = crypto.randomBytes(128).toString('hex');

    // Generate key for encryption
    userKey = crypto.randomBytes(128).toString('hex');

    // Create the user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address:req.body.address,
        userKey: userKey,
        token: token,
        verified: "N"
    });

    user.setPassword(req.body.password);

    // Save user in the database
    user.save()
    .then(data => {
        res.send(201, req.body);
    }).catch(err => {
        res.status(500).send({
            message: err.message + "Failed to register user"
        });
    });
};

// login user
exports.loginUser = (req, res) => {
    User.findOne( {email: req.body.email} )
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with email " + req.body.email
            });            
        }
        else { 
            if (user.validPassword(req.body.password)) { 
                if (user.verified == "N") {
                    return res.status(401).send({ 
                        message : "Not verified", 
                    }); 
                }
                else {
                    return res.status(200).send({ 
                        message : "User Logged In", 
                    }); 
                }
            } 
            else { 
                return res.status(401).send({ 
                    message : "Wrong Password"
                }); 
            }
        } 
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with email " + req.body.email
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with email " + req.body.email
        });
    });
 };



// Return user profile
exports.getUserProfile = (req, res) => {
    User.findOne({email: req.params.email}).select(["-hash","-salt","-token"])
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with email " + req.params.email
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with email " + req.params.email
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with email " + req.params.email
        });
    });
 };

