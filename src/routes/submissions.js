const express = require('express');

const { auth } = require('../middlewares/userAuth');
const { createSubmission, getAllSubmissions } = require('../controllers/submissions');

const router = express.Router();

// Endpoint for getting all submissions
router.route('/submissions').get(auth, getAllSubmissions);

// Endpoint for submitting a new Submission
router.route('/submissions').post(auth, createSubmission);

module.exports = router;