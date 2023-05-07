//Import library and functions
const express = require('express')
const app = express()
const { validateLoginRequestBody,
    validateSubmissionRequestBody,
    validateToken,
    validateAdminToken,
    validateAnswer } = require('./common')

//Define the port where the localhost will point to
const port = 3000

//Define the Users object
const USERS = [];

//Define and object to store the questions
const QUESTIONS = [{
    qid: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

//Define an object to store the submissions
const SUBMISSION = [];


/**
 * This is the main entry point of The application
 */
app.get('/', function (req, res) {

    outputMesg = '<html>' +
        '<body>' +
        '<h1>Welcome to our web server.</h1>' +
        '<p>Goto /signup route for creating a new account</p>' +
        '<p>Goto /login route for Logging in.</p>' +
        '<p>After successfully Logging in you can go to /questions page to veiw all the questions</p>' +
        '</body>' +
        '</html> '

    outputStatus = 200

    //Return the output to client
    res.status(outputStatus).send(outputMesg);
});

/**
 * This endpoint is called from Signup Page.
 * The endpoint perform checks to validate if client has sent non-blank values
 * for username and password in the request body.
 * It then validates if the user email already exists in the object USERS
 * If it does, then it sends back an error message, else adds the user to
 * the USER object and returns a success message.
 */
app.post('/signup', function (req, res) {

    //Validate the login request body to see if all required params are present
    let { outputMesg, outputStatus } = validateLoginRequestBody(req)

    if (outputStatus == 200) {

        // Extract email and password from the request body
        const { email, password, isAdmin } = req.body;

        // Check if user with the given email already exists in the USERS array
        const userExists = USERS.some(user => user.email === email);

        if (!userExists) {
            // If user with the given email does not exist, store email and password in the USERS array
            USERS.push({ email, password, isAdmin });

            // Return back 200 status code to the client with a success message
            outputMesg = 'User created successfully!';
            outputStatus = 200;

        } else {
            // If user with the given email already exists, return back a 409 status code (conflict) with an error message
            outputMesg = 'User with the given email already exists!';
            outputStatus = 409;
        }

    }

    //Return the output to client
    res.status(outputStatus).send(outputMesg);

});


/**
 * This endpoint is called from Login Page.
 * The endpoint perform checks to validate if client has sent non-blank values
 * for username and password in the request body.
 * It then validates if the user email already exists in the object USERS
 * If it does, then it validates the password matches the user.
 * If it does, then it sends back a token, else returns a error message.
 */
app.post('/login', function (req, res) {

    // Validate the login request body to see if all required params are present
    let { outputMesg, outputStatus } = validateLoginRequestBody(req);

    if (outputStatus == 200) {

        // Extract email and password from the request body
        const { email, password } = req.body;

        // Find the user with the given email in the USERS array
        const user = USERS.find(user => user.email === email);

        if (user) {

            // If user with the given email exists, check if the password is the same
            if (user.password === password) {

                // If the password is the same, generate a random token (for now) and send it back to the client
                const token = Math.random().toString(36).substring(7);

                // Store the token in a cookie with a secure flag and an httpOnly flag
                res.cookie('authToken', token, { secure: true, httpOnly: true });

                outputMesg = 'Login Successful!';
                outputStatus = 200;

            } else {
                // If the password is not the same, return a 401 status code with an error message
                outputMesg = 'Incorrect password';
                outputStatus = 401;
            }
        } else {
            // If user with the given email does not exist, return a 404 status code with an error message
            outputMesg = 'User not found';
            outputStatus = 404;
        }
    }

    //Return the output to client
    res.status(outputStatus).send(outputMesg);

});


/**
 * This endpoint is called from questions page.
 * The endpoint first validates the token and then displays the questions
 */
app.get('/questions', validateToken, function (req, res) {
    // Return all the questions in the QUESTIONS array to the client
    res.status(200).json(QUESTIONS);
});

/**
 * This endpoint will accept the submission to a Question displayed on the page
 */
// Define the route to submit a solution to a problem
app.post("/submissions", validateToken, function (req, res) {

    // Validate the submission request body to see if all required params are present
    let { outputMesg, outputStatus, question } = validateSubmissionRequestBody(req, QUESTIONS);

    if (outputStatus === 200) {

        // If the question with the given id exists, validate the answer
        const { testCases } = question;
        const result = validateAnswer(answer, testCases);

        // If the answer is correct, store the submission in the SUBMISSIONS array
        if (result.valid) { SUBMISSIONS.push({ qid, answer }) };

        outputMesg = result;
        outputStatus = 200;

        // Return the validation result to the client
        res.status(outputStatus).json(outputMesg);
    }

    // Return the error message to the client
    res.status(outputStatus).send(outputMesg);

});


/**
 * This endpoint returns the submissions to the question
 */
app.get("/submissions/:qid", validateToken, function (req, res) {

    // Get the qid parameter from the request
    const qid = parseInt(req.params.qid);

    // Find the submissions for the given qid in the SUBMISSIONS array
    const submissions = SUBMISSIONS.filter(submission => submission.qid === qid);

    // Return the submissions to the client
    res.status(200).json(submissions);
});



// Define the route to add a new problem
app.post("/problems", validateAdminToken, function (req, res) {

    // Get the problem details from the request body
    const { title, description, testCases } = req.body;

    //Find the length of QUESTIONS array, which will act as a qid for the next question
    const qid = QUESTIONS.length

    // Add the problem to the PROBLEMS array
    QUESTIONS.push({ qid, title, description, testCases });

    // Return a success message to the client
    res.status(200).json({ message: "Problem added successfully" });
});

app.listen(port, function () {
    console.log(`Express backend app listening on port ${port}`)
})
