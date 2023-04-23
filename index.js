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

app.use(express.json());

app.post('/signup', function(req, res) {
  const { email, password } = req.body;
  console.log("got log" , req.body)

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const user = USERS.find(user => user.email === email);

  if (user) {
    return res.status(409).send('User already exists');
  }

  USERS.push({ email, password });

  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const user = USERS.find(user => user.email === email);

  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  const token = Math.random().toString(36).substring(7);

  res.json({ token });
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});

app.get('/submissions', function(req, res) {
  const { problemIndex } = req.query;

  if (!problemIndex || isNaN(problemIndex)) {
    return res.status(400).send('Invalid problem index');
  }

  const submissions = SUBMISSIONS.filter(submission => submission.problemIndex === Number(problemIndex));

  res.json(submissions);
});

app.post('/submissions', function(req, res) {
  const { problemIndex, code } = req.body;

  if (!problemIndex || isNaN(problemIndex)) {
    return res.status(400).send('Invalid problem index');
  }

  if (!code) {
    return res.status(400).send('Code is required');
  }

  const accepted = Math.random() < 0.5;

  const submission = {
    problemIndex: Number(problemIndex),
    code,
    accepted
  };

  SUBMISSIONS.push(submission);

  res.json(submission);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
