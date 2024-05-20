const express = require('express');
const app = express();
const port = 3001;

app.use(express.json()); // Middleware to parse JSON bodies

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSIONS = [];

app.post('/signup', function (req, res) {
    // Decode body
    const { email, password } = req.body;

    // Check if the user with the given email already exists
    const userExists = USERS.some(user => user.email === email);

    if (!userExists) {
        // Store email and password (as is for now) in the USERS array
        USERS.push({ email, password });
        return res.status(200).send('Signup successful!');
    } else {
        return res.status(400).send('User already exists!');
    }
});

app.post('/login', function (req, res) {
    // Decode body
    const { email, password } = req.body;

    // Check if the user with the given email exists in the USERS array
    const user = USERS.find(user => user.email === email);

    if (user) {
        // Ensure that the password is the same
        if (user.password === password) {
            // If the password is the same, return back 200 status code to the client
            // Also send back a token (any random string will do for now)
            return res.status(200).json({ token: 'random-token-string' });
        } else {
            // If the password is not the same, return back 401 status code to the client
            return res.status(401).send('Invalid password!');
        }
    } else {
        return res.status(400).send('User does not exist!');
    }
});

app.get('/questions', function (req, res) {
    // Return the user all the questions in the QUESTIONS array
    res.status(200).json(QUESTIONS);
});

app.get('/submissions', function (req, res) {
    // Return the users' submissions for this problem
    res.status(200).json(SUBMISSIONS);
});

app.post('/submissions', function (req, res) {
    // Decode body
    const { userId, questionId, solution } = req.body;

    // Simulate acceptance or rejection randomly
    const isAccepted = Math.random() > 0.5;

    // Store the submission in the SUBMISSIONS array
    SUBMISSIONS.push({ userId, questionId, solution, isAccepted });

    // Return the result of the submission
    res.status(200).json({ isAccepted });
});

// Leaving as hard todos
// Create a route that lets an admin add a new problem
// Ensure that only admins can do that.

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
});
