const jwt = require('jsonwebtoken');


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

module.exports = {verifyConfirmationToken, generateAccessToken};