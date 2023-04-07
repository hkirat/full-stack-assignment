const express = require('express');

const { auth } = require('../middlewares/userAuth');
const { createQuestion, getAllQuestions } = require('../controllers/question');

const router = express.Router();

// Endpoint for getting all questions
router.route('/questions').get(auth, getAllQuestions);

// Endpoint for adding a new question
router.route('/questions').post(auth, createQuestion);

module.exports = router;