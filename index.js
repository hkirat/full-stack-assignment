const express = require('express');
const app = express();
const port = 3000;

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

app.use(express.json()); // Middleware to parse JSON body

// Signup Route
app.get('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email already exists
  const userExists = USERS.find(user => user.email === email);
  
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  // Add new user to USERS array
  USERS.push({ email, password });
  res.status(200).send('User successfully signed up');
});

// Login Route
app.get('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists
  const user = USERS.find(user => user.email === email);

  if (!user) {
    return res.status(404).send('User not found');
  }

  // Check if the password is correct
  if (user.password === password) {
    const token = 'random_token'; // This should be replaced with JWT or other token mechanisms in real applications
    return res.status(200).send({ message: 'Login successful', token });
  } else {
    return res.status(401).send('Invalid password');
  }
});

// Get Questions Route
app.get('/questions', function(req, res) {
  // Return all questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
});

// Get Submissions Route
app.get("/submissions", function(req, res) {
  // Return all submissions in the SUBMISSIONS array
  res.status(200).send(SUBMISSIONS);
});

// Submit Solution Route
app.post("/submissions", function(req, res) {
  const { questionTitle, submission } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() > 0.5;

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push({ questionTitle, submission, isAccepted });
  
  res.status(200).send({ message: isAccepted ? 'Solution accepted' : 'Solution rejected' });
});

// TODO: Admin route to add new questions

app.listen(port, function() {
  console.log(`App listening on port ${port}`);
});
