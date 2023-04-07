const express = require('express');

const { auth } = require('../middlewares/userAuth');
const { loginUser, signUpUser } = require('../controllers/user');
const router = express.Router();

// Endpoint for signing up a new user
router.route('/signup').post(signUpUser);

// Endpoint for logging in an existing user
router.route('/login').post(loginUser);

module.exports = router;