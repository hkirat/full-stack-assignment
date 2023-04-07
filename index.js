const express = require('express')
const app = express()
const port = 3000

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

app.use(express.json()); // middleware to parse the JSON body

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const userExists = USERS.some(user => user.email === email);

  if (!userExists) {
    USERS.push({ email, password });
    res.sendStatus(200);
  } else {
    res.status(400).send('User with that email already exists');
  }
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  if (user && user.password === password) {
    // Generate a random token (for simplicity, using a random string here)
    const token = Math.random().toString(36).substr(2);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});

app.get('/submissions', function(req, res) {
  res.json(SUBMISSIONS);
});

app.post('/submissions', function(req, res) {
  const { questionIndex, solution } = req.body;

  // Randomly accept or reject the solution
  const isSolutionCorrect = Math.random() >= 0.5;

  const submission = {
    questionIndex,
    solution,
    isCorrect: isSolutionCorrect
  };

  SUBMISSIONS.push(submission);

  res.sendStatus(200);
});

// Admin-only endpoint to add a new question
app.post('/admin/questions', function(req, res) {
  const { title, description, testCases } = req.body;

  // Check if user is an admin (for simplicity, using a hardcoded value here)
  const isAdmin = true;

  if (isAdmin) {
    const newQuestion = { title, description, testCases };
    QUESTIONS.push(newQuestion);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});
