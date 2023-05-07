
/**
 * This function validates if the login request body is valid is not
 * @param {*} req 
 * @returns {Object}
 */
function validateLoginRequestBody(req) {
    const { email, password } = req.body;

    // Check if both email and password are present in the request body
    if (!email) {
        return { outputMesg: 'Please provide an email address', outputStatus: 400 };
    }

    if (!password) {
        return { outputMesg: 'Please provide a password', outputStatus: 400 };
    }

    // Check if email and password are non-empty strings
    if (email.trim() === '') {
        return { outputMesg: 'Email cannot be blank', outputStatus: 400 };
    }

    if (password.trim() === '') {
        return { outputMesg: 'Password cannot be blank', outputStatus: 400 };
    }

    // If everything is valid, return a success message with a status code of 200
    return { outputMesg: 'Login request is valid', outputStatus: 200 };
}

/**
 * This function validates if the submission request is valid or not
 * and return the details of the question
 * @param {*} req 
 * @returns {Object}
 */
function validateSubmissionRequestBody(req, QUESTIONS) {

    let question = {}
    let outputMesg = ""
    let outputStatus

    // Get the submission details from the request body
    const { qid, solution } = req.body;

    if (!qid || !solution) {
        outputMesg = 'Missing required parameters';
        outputStatus = 400;
    }
    else {
        // Find the question with the given id in the QUESTIONS array
        question = QUESTIONS.find(question => question.qid === qid);

        if (question) {
            outputMesg = 'Success';
            outputStatus = 200;
        }
        else {
            outputMesg = 'Incorrect Question';
            outputStatus = 401;
        }
    }

    return { "outputMesg": outputMesg, "outputStatus": outputStatus, "question": question };
}


/**
 * This function validates if token exists in the request
 * by extracting the token from cookie. The cookie was saved
 * with name "authToken" 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function validateToken(req, res, next) {
    // Get the token from the cookie
    const token = req.cookies.authToken;

    // Check if the token is present
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token using your authentication mechanism
    // ...

    // Call the next middleware function if the token is valid
    next();
}

/**
 * This function validates if token exists in the request
 * by extracting the token from cookie. The cookie was saved
 * with name "authToken". It then validates if the token has admin
 * rights assigned to it.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function validateAdminToken(req, res, next) {
    // Get the token from the cookie
    const token = req.cookies.authToken;

    // Check if the token is present
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the token using your authentication mechanism
    // ...

    // Check if the user is an admin
    const isAdmin = true; // Replace this with your authentication mechanism
    if (!isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
    }

    // Call the next middleware function if the token is valid and the user is an admin
    next();
}


/**
 * This function validates if the function is valid or not
 * @param {*} answer 
 * @param {*} testCases 
 * @returns 
 */
function validateAnswer(answer, testCases) {
    let valid = true;
    let message = '';

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const { input, output } = testCase;

        if (answer !== output) {
            valid = false;
            message += `Test case ${i + 1} failed. Expected output: ${output}, actual output: ${result}. `;
        }
    }

    if (valid) {
        message = 'Answer is correct';
    } else {
        message = `Answer is incorrect. ${message}`;
    }

    return { valid, message };
}


module.exports = {
    validateLoginRequestBody,
    validateSubmissionRequestBody,
    validateToken,
    validateAdminToken,
    validateAnswer
}