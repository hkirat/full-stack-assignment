const express = require('express')
const app = express()
const port = 3000

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
app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if user with the given email already exists
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    // User already exists, return an error response
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  // Create a new user object
  const newUser = { email, password };

  // Store the new user in the USERS array
  USERS.push(newUser);

  // Return success response
  return res.status(200).json({ message: 'User registered successfully' });
})

const crypto = require('crypto');

// Function to generate a random token
function generateToken() {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  if (!user) {
    // User not found, return an error response
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if the password is the same
  if (user.password !== password) {
    // Password doesn't match, return an error response
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // If the password is the same, generate a token (random string for now)
  const token = generateToken();

  // Return success response with the token
  return res.status(200).json({ message: 'Login successful', token });
});


app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  // Return the user's submissions for this problem
  const userId = req.query.userId; // Assuming userId is passed as a query parameter
  const problemId = req.query.problemId; // Assuming problemId is passed as a query parameter

  // Perform logic to fetch user submissions based on userId and problemId
  const userSubmissions = fetchUserSubmissions(userId, problemId);

  // Return the user's submissions as the response
  res.status(200).json(userSubmissions);
});



app.post("/submissions", function(req, res) {
  // Let the user submit a problem
  const userId = req.body.userId; // Assuming userId is passed in the request body
  const problemId = req.body.problemId; // Assuming problemId is passed in the request body
  const solution = req.body.solution; // Assuming the user's solution is passed in the request body

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5; // Randomly accept or reject the solution (50% chance)

  // Create a new submission object
  const newSubmission = { userId, problemId, solution, isAccepted };

  // Store the submission in the SUBMISSION array
  SUBMISSIONS.push(newSubmission);

  // Return a response to the user
  res.status(200).json({ message: "Submission received", isAccepted });
});


// leaving as hard todos
// Middleware function to check if the user is an admin
function isAdmin(req, res, next) {
  const isAdminUser = req.headers.isAdmin; // Assuming isAdmin is passed in the request headers
  if (isAdminUser) {
    // User is an admin, continue to the next middleware
    next();
  } else {
    // User is not an admin, return an unauthorized error response
    res.status(401).json({ error: 'Unauthorized access' });
  }
}

// Create a route that lets an admin add a new problem
app.post('/problems', isAdmin, function(req, res) {
  // Add logic to create a new problem
  const problem = req.body; // Assuming the problem details are passed in the request body

  // Add the new problem to the PROBLEMS array or store it in the database

  // Return a response indicating the successful addition of the problem
  res.status(200).json({ message: 'Problem added successfully' });
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
