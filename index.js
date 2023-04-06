const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth'); 
const questions = require('./questions'); 
const submissions = require('./submissions'); 
const app = express();

app.use(bodyParser.json());
const questions = [
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
const submissions = [];

app.post('/signup', function (req, res) {
  // implementation for user signup
});

app.post('/login', function (req, res) {
  // implementation for user login
});

app.get('/questions', function (req, res) {
  // implementation for getting all questions
});

app.get('/submissions/:title', function (req, res) {
  const title = req.params.title;

  const filteredSubmissions = submissions.filter(
    (submission) => submission.title === title
  );

  if (filteredSubmissions.length === 0) {
    res.status(404).send('No submissions found for this problem');
  } else {
    res.json(filteredSubmissions);
  }
});

app.post('/submissions/:title', auth.requireAuth, function (req, res) {
  const title = req.params.title;
  const solution = req.body.solution;

  const isAccepted = Math.random() >= 0.5;

  submissions.push({ title, solution, isAccepted });

  res.sendStatus(200);
});

app.post('/problems', auth.requireAdmin, function (req, res) {
  const { title, description, testCases } = req.body;

  if (!title || !description || !testCases) {
    res.status(400).send('Missing required fields');
  } else {
    questions.push({ title, description, testCases });
    res.sendStatus(200);
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000');
});