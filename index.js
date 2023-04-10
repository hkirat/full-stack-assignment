// Import Library
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

// Import Middleware
const AdminVerifyMiddleware =  require('./src/middleware/AdminVerifyMiddleware');

// Body Parser Implement
app.use(bodyParser.json());

// Define Port
const port = 3000;

// User Array
const USERS = [];

// Question Array
const QUESTIONS = [{
    id : 1,
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

// Submission Array
const SUBMISSION = []

// Route for signing up a new user
app.post('/signup', function(req, res) {

    let reqBody = req.body;
    let email = reqBody['email'];
    let password = reqBody['password'];

    // Check if the user with the given email already exists
    if (USERS.some(user => user.email === email)) {
        return res.status(409).send("User already exists");
    }

    // Add new user to USERS array
    USERS.push({ email, password });

    res.status(200).send('User signed up successfully');
});

// Route for logging in a user
app.post('/login', function(req, res) {
    let reqBody = req.body;
    let email = reqBody['email'];
    let password = reqBody['password'];

    // Find user with the given email in USERS array
    const user = USERS.find(user => user.email === email);

    // Check if user exists and password is correct
    if (user && user.password === password) {

        // JSON Web Token Create
        let payload = {
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
            data: user
        }
        let token = jwt.sign(payload, 'Secret@123');

        return res.status(200).send({ token });
    }else{
        // If user doesn't exist or password is incorrect, return a 401 Unauthorized status
        res.status(401).send("Invalid email or password");
    }

});

// Route for getting all questions
app.get('/questions', function(req, res) {
    // Return QUESTIONS array as JSON response
    res.status(200).json(QUESTIONS);
});

// Route for getting all submissions for a problem
app.get('/submissions/:questionTitle', function(req, res) {
    // Get question title from request params
    const questionTitle = req.params.questionTitle;


    // Filter SUBMISSIONS array to get all submissions for the given question
    const submissions = SUBMISSION.filter(submission => submission.questionTitle === questionTitle);

    // Return submissions as JSON response
    res.status(200).json(submissions);
});

// Route for submitting a solution to a problem
app.post('/submissions', function(req, res) {
    // Get question title and solution from request body
    let reqBody = req.body;
    let questionTitle = reqBody['questionTitle'];
    let solution = reqBody['solution'];

    // Randomly accept or reject solution for now
    const isAccepted = Math.random() >= 0.5;

    // Add submission to SUBMISSIONS array
    SUBMISSION.push({ questionTitle, solution, isAccepted });

    // Return a 200 OK status with a message indicating whether the solution was accepted or rejected
    const message = isAccepted ? "Solution accepted!" : "Solution rejected";
    res.status(200).send(message);
});

// Route for adding a new problem (only accessible by admins)
// If user is not an admin, return a 401 Unauthorized
app.post('/problems', AdminVerifyMiddleware, function(req, res) {

    // Add logic to decode body
    let reqBody = req.body;
    let title = reqBody['title'];
    let description = reqBody['description'];
    let testCases = reqBody['testCases'];

    // Add the new problem to the QUESTIONS array
    QUESTIONS.push({
        title,
        description,
        testCases
    });

    // Return a 200 status code to the client to indicate success
    res.status(200).send('Problem created successfully');
});

app.listen(port, function (){
    console.log("App is running on port : "+ port);
})
