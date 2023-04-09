const express = require('express');

const { login, signUp } = require('../controllers/users');
const router = express.Router();

// Endpoint for signing up a new user
router.route('/signup').post(signUp);

// Endpoint for logging in an existing user
router.route('/login').post(login);

module.exports = router;