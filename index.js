const express = require('express');
const app = express();
const port = 3001;

const users = [];

const questions = [{  title: "Two States",  description: "Given an array, return the maximum of the array?",  testCases: [{    input: "[1,2,3,4,5]",    output: "5"  }]
}];

const submissions = [];

const admins = [  { email: "admin@example.com", password: "admin123" }];

// Middleware to parse the request body as JSON
function parseJson(req, res, next) {
  express.json()(req, res, err => {
    if (err) {
      console.error(err);
      res.sendStatus(400);
      return;
    }
    next();
  });
}
app.use(parseJson);

// Route for user signup
function userSignup(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).send('User with this email already exists');
  }

  // Store the user in the USERS array
  users.push({ email, password });

  // Return 200 status code to the client
  res.sendStatus(200);
}
app.post('/signup', userSignup);

// Route for user login
function userLogin(req, res) {
  const { email, password } = req.body;

  // Find the user with the given email
  const user = users.find(user => user.email === email);

  if (!user || user.password !== password) {
    return res.status(401).send('Incorrect email or password');
  }

  // Return a random token (for simplicity, using a hardcoded string)
  const token = 'random-token';
  res.json({ token });
}
app.post('/login', userLogin);

// Route to get all questions
function getQuestions(req, res) {
  res.json(questions);
}
app.get('/questions', getQuestions);

// Route to get submissions for a problem
function getSubmissions(req, res) {
  const { questionId } = req.params;

  // Find the submissions for the given questionId
  const filteredSubmissions = submissions.filter(submission => submission.questionId === questionId);
  res.json(filteredSubmissions);
}
app.get('/submissions/:questionId', getSubmissions);

// Route to submit a solution for a problem
function submitSolution(req, res) {
  const { questionId } = req.params;
  const { solution } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() >= 0.5;

  // Store the submission in the SUBMISSIONS array
  submissions.push({ questionId, solution, isAccepted });

  // Return a response to the client
  const status = isAccepted ? 200 : 400;
  res.sendStatus(status);
}
app.post('/submissions/:questionId', submitSolution);

// Route to add a new problem (only accessible to admins)
function addQuestion(req, res) {
  const { email, password } = req.headers;
  const { title, description, testCases } = req.body;

  // Check if the user is an admin
  const isAdmin = admins.find(admin => admin.email === email && admin.password === password);
  if (!isAdmin) {
    return res.status(403).send('Only admins can perform this operation');
  }

  // Add the new problem to the QUESTIONS array
  questions.push({ title, description, testCases });

  // Return a response
  const status = isAccepted ? 200 : 400;
  res.sendStatus(status);}