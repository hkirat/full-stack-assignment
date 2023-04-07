const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSIONS = [
  {
    id: 1,
    userId: 1,
    problemId: 1,
    code: 'console.log("Hello, world!");',
    language: 'JavaScript',
    status: 'Accepted',
  },
  {
    id: 2,
    userId: 2,
    problemId: 1,
    code: 'print("Hello, world!")',
    language: 'Python',
    status: 'Compilation Error',
  },
  {
    id: 3,
    userId: 1,
    problemId: 2,
    code: 'alert("Hello, world!");',
    language: 'JavaScript',
    status: 'Time Limit Exceeded',
  },
];

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  // Check if user with email already exists
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send({ message: 'User with email already exists' });
  }

  // Add new user to USERS array
  USERS.push({ email, password });

  // Return success message and status code 200 to client
  res.status(200).send({ message: 'User created successfully' });
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  // Find user with the given email in the USERS array
  const user = USERS.find(user => user.email === email);

  // Check if user was found and if password is correct
  if (!user || user.password !== password) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  // Generate and return a random token (for simplicity, we'll just use a string)
  const token = Math.random().toString(36).substr(2);
  return res.status(200).send({ token });
});

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
});


app.get('/submissions', function(req, res) {
  const userId = req.query.userId;
  const problemId = req.query.problemId;

  // Filter the SUBMISSIONS array to only include submissions for the specified user and problem
  const submissions = SUBMISSIONS.filter(submission => submission.userId == userId && submission.problemId == problemId);

  // Return the filtered submissions in the response body
  res.status(200).send(submissions);
});


app.post('/submissions', function(req, res) {
  const userId = req.body.userId;
  const problemId = req.body.problemId;
  const code = req.body.code;
  const language = req.body.language;

  // Generate a random number between 0 and 1
  const random = Math.random();

  // Randomly accept or reject the solution
  const status = random < 0.5 ? 'Accepted' : 'Wrong Answer';

  // Create a new submission object and add it to the SUBMISSIONS array
  const submission = { id: SUBMISSIONS.length + 1, userId, problemId, code, language, status };
  SUBMISSIONS.push(submission);

  // Return a response with the new submission object and a 200 status code
  res.status(200).send(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

const PROBLEMS = [];
const ADMINS = ['admin1', 'admin2'];

app.post('/problems', function(req, res) {
  const username = req.headers.username;
  const isAdmin = ADMINS.includes(username);

  if (!isAdmin) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const { title, description, difficulty } = req.body;

  // Validate the request body
  if (!title || !description || !difficulty) {
    return res.status(400).send({ message: 'Bad Request' });
  }

  // Add the new problem to the PROBLEMS array
  const problem = { id: PROBLEMS.length + 1, title, description, difficulty };
  PROBLEMS.push(problem);

  // Return a response with the new problem object and a 200 status code
  res.status(200).send(problem);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})