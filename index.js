const express = require('express');
const app = express();
const port = 3000;

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

  if (USERS.find((user) => user.email === email)) {
    return res.status(409).send('User already exists');
  }

  USERS.push({ email, password });

  res.sendStatus(200);
});


app.post('/login', function (req, res) {
  const { email, password } = req.body;

  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  res.status(200).json({ token: 'random-token' });
});

app.get('/questions', function (req, res) {
  res.json(QUESTIONS);
});

app.get('/submissions/:title', function (req, res) {
  const title = req.params.title;

  const submissions = SUBMISSIONS.filter(
    (submission) => submission.title === title
  );

  res.json(submissions);
});

app.post('/submissions/:title', function (req, res) {
  const title = req.params.title;
  const solution = req.body.solution;

  const isAccepted = Math.random() >= 0.5;

  SUBMISSIONS.push({ title, solution, isAccepted });

  res.sendStatus(200);
});

app.post('/problems', function (req, res) {
  const isAdmin = true;
  if (!isAdmin) {
    return res.status(401).send('Not authorized');
  }

  const { title, description, testCases } = req.body;

  QUESTIONS.push({ title, description, testCases });

  res.sendStatus(200);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
