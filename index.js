const express = require('express');
const bodyParser = require('body-parser');
const emailValidator = require('email-validator');
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/signup', function(req, res) {
  const password = sanitizeHtml(req.body.password);
  const email = sanitizeHtml(req.body.email);

  if (!emailValidator.validate(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  USERS.push({
    email: email,
    password: hashedPassword
  });

  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  const password = sanitizeHtml(req.body.password);
  const email = sanitizeHtml(req.body.email);

  const user = USERS.find((user) => user.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email: email }, 'secret-key');

  res.status(200).json({ token: token });
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});

app.get('/submissions', function(req, res) {
  res.json(SUBMISSIONS);
});

app.post('/submissions', function(req, res) {
  const submission = {
    problemTitle: req.body.problemTitle,
    userSolution: req.body.userSolution,
    accepted: Math.random() >= 0.5
  };

  SUBMISSIONS.push(submission);

  res.sendStatus(200);
});

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
// Assuming that we have an admin user with email 'admin@example.com'
// and password 'password' for this example

app.post('/add-problem', function(req, res) {
  const password = sanitizeHtml(req.body.password);
  const email = sanitizeHtml(req.body.email);

  const user = USERS.find((user) => user.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (email !== 'admin@example.com') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const newProblem = {
    title: sanitizeHtml(req.body.title),
    description: sanitizeHtml(req.body.description),
    testCases: req.body.testCases.map((testCase) => ({
      input: sanitizeHtml(testCase.input),
      output: sanitizeHtml(testCase.output)
    }))
  };

  QUESTIONS.push(newProblem);

  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
