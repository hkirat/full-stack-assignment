const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

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

app.post('/signup', function(req, res) {
    const { email, password } = req.body;

    // Check if the user already exists
    const userExists = USERS.find(user => user.email === email);
    if (userExists) {
        return res.status(400).send('User already exists');
    }

    // Add new user
    USERS.push({ email, password });
    res.status(200).send('User registered successfully');
});

app.post('/login', function(req, res) {
    const { email, password } = req.body;

    // Check if the user exists
    const user = USERS.find(user => user.email === email);
    if (!user || user.password !== password) {
        return res.status(401).send('Invalid email or password');
    }

    // Return a token (for simplicity, just a random string)
    const token = 'random-token-string';
    res.status(200).json({ token });
});

app.get('/questions', function(req, res) {
    res.status(200).json(QUESTIONS);
});

app.get('/submissions', function(req, res) {
    res.status(200).json(SUBMISSIONS);
});

app.post('/submissions', function(req, res) {
    const { userId, questionId, submission } = req.body;

    // Randomly accept or reject the solution
    const isAccepted = Math.random() > 0.5;
    SUBMISSIONS.push({ userId, questionId, submission, isAccepted });

    res.status(200).json({ isAccepted });
});

// Admin route to add a new problem
app.post('/problems', function(req, res) {
    const { title, description, testCases, admin } = req.body;

    // Simple admin check
    if (!admin || admin !== 'admin-secret') {
        return res.status(403).send('Only admins can add problems');
    }

   
