const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

const USERS = [];
const QUESTIONS = [{
    id: 1,
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}, {
    id: 2,
    title: "Find the sum of all no.s",
    description: "Given an array, return the sum of all the no.s",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "15"
    }]
}];

SUBMISSIONS = [];

app.post('/signup', (req, res) => {
    const { email, password, isAdmin } = req.body;
    const userExists = USERS.some(user => user.email === email);

    if (userExists) {
        // If a user with the given email already exists, send an error response
        res.status(400).json({ error: 'User with email already exists' });
    } else {
        // If a user with the given email doesn't exist, add the new user to the array
        USERS.push({ email, password, isAdmin });
        res.status(200).json({ message: 'User created successfully' });
    }
})

app.post('/login', (req, res) => {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Find the user with the given email in the USER array
    const user = USERS.find(user => user.email === email);

    if (!user) {
        // If a user with the given email doesn't exist, send an error response
        res.status(401).json({ error: 'Invalid email or password' });
    } else if (user.password !== password) {
        // If the password is incorrect, send an error response
        res.status(401).json({ error: 'Invalid email or password' });
    } else {
        // If the email and password are correct, create a JWT token with the user's email and isAdmin value
        const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, 'my_secret_key');
        res.status(200).json({ token });
    }
});


app.get('/questions', (req, res) => {
    res.json(QUESTIONS);
})


let questionId = 3;

app.post('/question', (req, res) => {
    const { email, title, description, testCases } = req.body;

    // Check if the user is an admin based on their email ID
    const user = USERS.find(user => user.email === email);
    if (!user || !user.isAdmin) {
        res.status(401).json({ message: 'You are not authorized to perform this action' });
    }

    // Create a new question object with the auto-incremented ID
    const newQuestion = { id: questionId++, title, description, testCases };

    // Add the question to the QUESTIONS array
    QUESTIONS.push(newQuestion);

    // Send a response indicating that the question was added
    res.status(200).json({ message: 'Question added successfully' });
});



app.get('/submissions/:userId', (req, res) => {
    const { userId } = req.params;

    // Find the submission with the matching email in the SUBMISSIONS array
    const submission = SUBMISSIONS.find(sub => sub.userId === userId);

    if (submission) {
        // If a submission is found, send a response with the submission object
        res.status(200).json(submission);
    } else {
        // If a submission is not found, send a response indicating that the submission does not exist
        res.status(404).json({ message: 'Submission not found' });
    }
});

app.post('/submissions', (req, res) => {
    const { userId, questionId, code } = req.body;

    // Randomly assign a solution status to the code
    const status = Math.random() < 0.5 ? 'Accepted' : 'Rejected';

    // Create a submission object with the code, solution, and email
    const submission = { userId, questionId, code, status };

    // Add the submission to the SUBMISSIONS array
    SUBMISSIONS.push(submission);

    // Send a response indicating the submission was successful
    res.status(200).json({ message: 'Submission successful' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})