const express = require('express')
const app = express()
const port = 3001

var userId = 3

// we don't want to store user passwords anywhere in actual applications
// this is just for testing all requests
const USERS = [];

const QUESTIONS = [{
  id: 1,
  title: "Two states",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSIONS = [];

// we will use express.json to decode the request body for POST requests
app.use(express.json());

app.get('/users', (req, res) => {
    res.json({USERS})
})

app.post('/signup', (req, res) => {
    const { email, password } = req.body;

    let id = userId++

    // Check if user with email already exists
    const userExist = USERS.find(user => user.email === email);
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    USERS.push({ id, email, password });

    res.sendStatus(200);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user with email exists and if password is correct
    const userExist = USERS.find(user => user.email === email);
    if (!userExist || userExist.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send random token
    const token = Math.random().toString(36).substring(2);
    res.status(200).json({ token });
});

app.get('/questions', (req, res) => {
    res.status(200).json({ questions: QUESTIONS });
});

app.get('/submissions', (req, res) => {
    const { userId, questionId } = req.body;
    if (!userId || !questionId) {
      res.status(400).send("User & question ID's are required.");
      return;
    }

    const userSubmissions = SUBMISSIONS.filter(submission => submission.userId === userId && submission.questionId === questionId);
    res.status(200).json(userSubmissions);
});

app.post('/submissions', (req, res) => {
    const { userId, questionId, code } = req.body;
    if (!userId || !questionId || !code) {
      res.status(400).send("User ID, question ID, and code are required.");
      return;
    }
    // Using Math.random() to randomly accept/decline submissions
    const accepted = Math.random() >= 0.5;

    SUBMISSIONS.push({ userId, questionId, code, accepted });

    res.status(200).json({ accepted });
});

// Create a route that lets an admin add a new problem
// Ensure that only admins can do that.
app.post('/admin/questions', (req, res) => {
    const { title, description, testCases } = req.body;

    // for the sake of this exercise, lets give the admins an auth header
    // iff this header is passed with the req, than only allow the question to be added
    if (!req.headers.authorization || req.headers.authorization !== 'admin-token') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let id = QUESTIONS.length + 1
    QUESTIONS.push({ id, title, description, testCases });

    res.sendStatus(200);
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}`);
});