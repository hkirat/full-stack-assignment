const jwt = require('jsonwebtoken');
const cache = require('memory-cache');
const QUESTIONS = require('./questions');


// Use JWT_SECRET environment variables to sign and verify JWTs
const SIGN_UP_SECRET = `${process.env.JWT_SECRET_SIGN_UP}`;
// function to verify confirmation token and remove from array
const verifyConfirmationToken = (confirmationTokens, email, token) => {
    let foundIndex;
    const found = confirmationTokens.some((item, index) => { foundIndex = index; return item.email === email && item.token === token; });
    if (found) {
        confirmationTokens.splice(foundIndex, 1);
    }
    return found;
};
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