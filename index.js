const express = require('express');
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
{
title: "Two states",
description: "Given an array, return the maximum of the array?",
testCases: [
{
input: "[1,2,3,4,5]",
output: "5"
}
]
}
];

const SUBMISSIONS = [];

app.use(express.json());

// Sign up route
app.post('/signup', function(req, res) {
const { email, password } = req.body;

// Check if user already exists with the given email
const existingUser = USERS.find(user => user.email === email);
if (existingUser) {
res.status(409).send('User already exists');
return;
}

// Create a new user and add to USERS array
const newUser = { email, password };
USERS.push(newUser);

res.status(200).send('User registered successfully');
});

// Login route
app.post('/login', function(req, res) {
const { email, password } = req.body;

// Find the user with the given email
const user = USERS.find(user => user.email === email);
if (!user) {
res.status(401).send('Invalid email or password');
return;
}

// Check if the password matches
if (user.password !== password) {
res.status(401).send('Invalid email or password');
return;
}

// Return a token as a response
const token = 'RANDOM_TOKEN'; // Generate a random token
res.status(200).json({ token });
});

// Get all questions route
app.get('/questions', function(req, res) {
res.status(200).json(QUESTIONS);
});

// Get user's submissions for a problem route
app.get('/submissions', function(req, res) {
// Assuming the user is authenticated and token is provided
// Get the user's submissions from the SUBMISSIONS array
const userSubmissions = SUBMISSIONS.filter(submission => submission.userId === req.user.id);

res.status(200).json(userSubmissions);
});

// Submit a problem route
app.post('/submissions', function(req, res) {
// Assuming the user is authenticated and token is provided
const { problemId, solution } = req.body;

// Randomly accept or reject the solution
const isAccepted = Math.random() < 0.5;

// Store the submission in the SUBMISSIONS array
const newSubmission = {
userId: req.user.id,
problemId,
solution,
isAccepted
};
SUBMISSIONS.push(newSubmission);

res.status(200).json({ message: 'Submission added successfully' });
});

app.listen(port, function() {
console.log(Example app listening on port ${port});
});
