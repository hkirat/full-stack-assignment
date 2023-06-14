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


const SUBMISSION = [

]

app.post('/register', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  // Check if a user with the given email already exists
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).send('User with the provided email already exists.');
  }

  // Store email and password in the USERS array
  USERS.push({ email, password });

  // Return 200 status code to the client
  res.sendStatus(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  // If the user is not found or the password is incorrect, return a 401 status code (Unauthorized)
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password.');
  }

  // If the user and password match, generate a token (any random string for now)
  const token = generateToken();

  // Return 200 status code and the token to the client
  res.status(200).json({ token });
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // Add logic to decode body
  // body should have problemId and solution

  const { problemId, solution } = req.body;

  // Generate a random acceptance status (true or false)
  const isAccepted = Math.random() < 0.5;

  // Create a new submission object
  const submission = {
    problemId,
    solution,
    isAccepted
  };

  // Store the submission in the SUBMISSION array
  SUBMISSION.push(submission);

  // Return the submission status (accepted or rejected) to the client
  res.json({ isAccepted });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})