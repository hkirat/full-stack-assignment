const express = require('express');
const app = express();
const port = 3005;
const bodyParser = require('body-parser');

const USERS = [];
const ADMINS = ['admin1', 'admin2', 'admin3']

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSION = [];


app.use(bodyParser.urlencoded({ extended: false }));

app.post('/signup', function(req, res) {
  // Get email and password from request body
  const { email, password } = req.body;
  

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    // User already exists, send a response with an error message
    res.status(409).send('The email youre trying to use already has a user associated with it!');
  } else {
    // User doesn't exist, add them to the array
    users.push({ email, password });
  }

  // return back 200 status code to the client
  res.status(200).send('User created successfully!');
});

app.post('/login', function(req, res) {
  // Get email and password from request body
  const { email, password } = req.body;

  // Find user with matching email in the users array
  const user = users.find(user => user.email === email);

  if (user && user.password === password) {
    // User is authenticated, generate a token (for now, we'll just use a random string)
    const token = Math.random().toString(12).substring(5);

    // Add the token to the user object
    user.token = token;

    // Send a response with a 200 status code and the token in the body
    res.status(200).send({ token });
  } else {
    // User is not authenticated, send a response with a 401 status code
    res.status(401).send(' Login Failed, Please check Your Username or Password!');
  }
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", (req, res) => {
  const userId = req.query.userId
  const problemId = req.query.problemId

  // Filter submissions by user ID and problem ID (if provided)
  const userSubmissions = SUBMISSION.filter(submission => {
    if (problemId) {
      return submission.userId === userId && submission.problemId === problemId
    } else {
      return submission.userId === userId
    }
  })

  // Return user's submissions for the problem (if problem ID provided)
  // or all user's submissions (if no problem ID provided)
  res.send(userSubmissions)
});

app.post("/submissions", (req, res) => {
  const userId = req.body.userId
  const problemId = req.body.problemId
  const solution = req.body.solution

  // Randomly accept or reject the solution (50/50 chance)
  const isAccepted = Math.random() < 0.5

  // Create a new submission object
  const submission = { userId, problemId, solution, isAccepted, timestamp: new Date() }

  // Add the submission to the SUBMISSIONS array
  SUBMISSION.push(submission)

  // Return a response indicating whether the solution was accepted or rejected
  const status = isAccepted ? 'accepted' : 'rejected'
  res.send(`Your solution has been ${status}!`)
});

app.post('/problems', (req, res) => {
  const userRole = req.body.role
  const problem = req.body.problem

  // Check if the user is an admin
  if (!ADMINS.includes(userRole)) {
    return res.status(401).send('Unauthorized')
  }

  // Add the problem to the PROBLEMS array
  PROBLEMS.push(problem)

  // Return a success response
  res.status(200).send('Problem added successfully')
});


app.listen(port, function () {
  console.log(`Server Side Is Running and Listening at ${port}`);
});