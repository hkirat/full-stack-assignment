const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(bodyParser.json());

const USERS = [];

const QUESTIONS = [
  {
    title: 'Two states',
    description: 'Given an array, return the maximum of the array?',
    testCases: [
      {
        input: '[1,2,3,4,5]',
        output: '5',
      },
    ],
  },
];

const SUBMISSIONS = [];

app.post('/signup', function (req, res) {
  const { email, password } = req.body;

  if (!USERS.find((user) => user.email === email)) {
    USERS.push({ email, password });
    res.sendStatus(200);
  } else {
    res.status(409).send('User already exists');
  }
});

app.post('/login', function (req, res) {
  const { email, password } = req.body;

  const user = USERS.find((user) => user.email === email);
  if (user && user.password === password) {
    res.status(200).send('Logged in successfully');
  } else {
    res.status(401).send('Invalid email or password');
  }
});

app.get('/questions', function (req, res) {
  res.json(QUESTIONS);
});

app.get('/submissions', function (req, res) {
  res.json(SUBMISSIONS);
});

app.post('/submissions', function (req, res) {
  const submission = req.body;
  submission.result = Math.random() > 0.5 ? 'Accepted' : 'Rejected';
  SUBMISSIONS.push(submission);
  res.status(201).json(submission);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
