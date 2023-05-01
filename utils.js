const jwt = require('jsonwebtoken');
const cache = require('memory-cache');
const QUESTIONS = require('./questions');


// Use JWT_SECRET environment variables to sign and verify JWTs
const SIGN_UP_SECRET = `${process.env.JWT_SECRET_SIGN_UP}`;

// function to verify confirmation token and remove from array
const verifyConfirmationToken = (confirmationTokens, email, token) => {
    const index = confirmationTokens.findIndex(item => item.email === email && item.token === token);
    if (index !== -1) {
        confirmationTokens.splice(index, 1);
        return true;
    }
    return false;
};
// Method to generate access token
const generateAccessToken = (email) => jwt.sign({ email }, SIGN_UP_SECRET, { expiresIn: '1h' });

// Define a function to get the questions
const getQuestions = () => {
    // Check if the questions are cached
    const cachedQuestions = cache.get('questions');
    if (cachedQuestions) {
        return cachedQuestions;
    }

    // If the questions are not cached, fetch them from the database
    const questions = QUESTIONS;

    // Cache the questions for 5 minutes
    cache.put('questions', questions, 5 * 60 * 1000);

    // Return the questions
    return questions;
}

module.exports = {verifyConfirmationToken, generateAccessToken, getQuestions};