const express = require('express')
const app = express()
const port = 3001

app.use(express.json());

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []

app.post('/signup', function(req, res) {
 // Retrieve email and password from the request body
  const { email, password } = req.body;

  // Check if the user with the given email already exists
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    return res.status(400).json({
      error: 'User already exists'
    });
  }

  // Create a new user object
  const newUser = {
    email,
    password
  };

  // Add the new user to the USERS array
  USERS.push(newUser);

  // Return a success response
  return res.status(200).json({
    message: 'User created successfully'
  });
});

app.post('/login', function(req, res) {
  // Retrieve email and password from the request body
  const { email, password } = req.body;

  // Find the user with the given email
  const user = USERS.find(user => user.email === email);

  // Check if the user exists and the password is correct
  if (user && user.password === password) {
    // If the password is correct, return a success response
    return res.status(200).json({
      message: 'Login successful',
      token: 'your-random-token'
    });
  } else {
    // If the user doesn't exist or the password is incorrect, return an error response
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }
});

app.get('/questions', function(req, res) {
 // Return all the questions in the QUESTIONS array
  return res.json(QUESTIONS);
});
 

app.get("/submissions", function(req, res) {
 // Return the user's submissions for this problem
  const userId = req.query.userId; // Assuming the user ID is provided as a query parameter

  const userSubmissions = SUBMISSIONS.filter(submission => submission.userId === userId);

  return res.json(userSubmissions);
});



app.post("/submissions", function(req, res) {
   // Let the user submit a problem
  const { userId, problemId, code } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Create a new submission object
  const newSubmission = {
    userId,
    problemId,
    code,
    isAccepted
  };

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push(newSubmission);

  // Return a response
  if (isAccepted) {
    return res.status(200).json({
      message: 'Submission accepted'
    });
  } else {
    return res.status(400).json({
      message: 'Submission rejected'
    });
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
