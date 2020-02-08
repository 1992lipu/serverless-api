// Initialize express router
let router = require('express').Router();

// Import user controller
var userController = require('../controllers/user.controller.js');

// user routes
router.route('/signup')
    .post(userController.regsiterUser);

router.route('/login')
    .post(userController.loginUser);

router.route('/:email')
    .get(userController.getUserProfile);

// Export API routes
module.exports = router;

