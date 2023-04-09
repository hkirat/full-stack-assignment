const express = require('express')
const app = express()
const port = 3001

const USERS = [
  {
    email: 'admin@email.com',
    password: 'admin123',
    role: 'admin'
  }
];

const AUTHTOKEN = "adminonly"

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
    }]
  },
  {
    title: "Palindrome Number",
    description: "Given an array , return the maximum of the array?Given an integer x, return true if x is apalindrome, and false otherwise.",
    testCases: [{
      input: "x = 121",
      output: "true"
    }]
  },
  {
    title: "Reverse Integer",
    description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], then return 0.",
    testCases: [{
      input: "x = 123",
      output: "321"
    }]
  }
];

const SUBMISSION = [];

app.use(express.json());

app.post('/signup', function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("field missing")
    return
  }

  // Check if user already exists
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  // Create new user and add to USERS array
  USERS.push({ email, password, role: 'user' });
  res.status(200).send("User created!");
});

app.post('/login', function (req, res) {
  const { email, password } = req.body;

  // Check if user exists and password matches
  const user = USERS.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // Generate random token (for demo purposes)
  const token = Math.random().toString(36).substring(7);

  res.status(200).json({ token });
});

app.get('/users', function (req, res) {
  const users = USERS.map(user => ({ email: user.email, role: user.role }));
  res.status(200).json(USERS);
});

app.get('/questions', function (req, res) {
  res.status(200).json(QUESTIONS);
});

app.get('/submissions', function (req, res) {
  // TODO: Return the user's submissions for this problem
  res.status(200).send(SUBMISSION);
});

app.post('/submissions', function (req, res) {
  const { solution } = req.body;
  // TODO: Let the user submit a problem, randomly accept or reject the solution
  chance = Math.random() * 10
  chanceInt = Math.ceil(chance)
  // Store the submission in the SUBMISSION array above
  if (chanceInt > 5) {
    SUBMISSION.push(solution)
    res.status(200).send('Solution has been added!');
  } else {
    res.status(401).send('Solution is not accepted!')
  }
});

// Create a route that lets an admin add a new problem
// Ensure that only admins can do that.
app.post('/questions', function (req, res) {
  const { title, description, testCases } = req.body;
  // TODO: Check if user is an admin (for demo purposes, always allow adding a question)
  if (!req.headers.authorization) {
    return res.status(400).send('Authorisation not correct')
  }
  // Create new question and add to QUESTIONS array
  if (AUTHTOKEN === req.headers.authorization) {
    QUESTIONS.push({ title, description, testCases })
    res.status(200).send('Question Added!');
  } else {
    res.status(304).send('Not Authorised!')
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});