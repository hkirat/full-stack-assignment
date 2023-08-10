
const express = require('express')
const app = express()
const port = 3002;
const USERS = [];
const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
  }]
}];
const SUBMISSION = [];

app.use(express.json()); // Middleware to parse JSON request bodies

app.post('/signup', function(req, res) {
  // Decode the request body (assuming it's in JSON format)
  const { email, password } = req.body;

  // Check if a user with the given email already exists
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send('User with this email already exists');
}
// Store the new user's information in the USERS array
USERS.push({ email, password });

// Return a success response
res.status(200).send('User signed up successfully');
});

app.post('/login', function(req, res) {
  const { email, password } = req.body; // Assuming email and password are sent in the request body

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  if (!user) {
    return res.status(401).send('User not found'); // User does not exist
  }

  // Check if the provided password matches the stored password
  if (user.password === password) {
    // Generate a random token (for demonstration purposes)
    const token = Math.random().toString(36).substr(2);
    res.send('Hello from route 2')
    // Return a success response with a token
    return res.status(200).json({ token: token });
  } else {
    return res.status(401).send('Incorrect password'); // Password does not match
  }
});

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
  res.send('Hello from route 3')
});

app.get('/submissions', function(req, res) {
  const { problemId } = req.query; // Assuming problemId is sent as a query parameter

  // Filter submissions for the specific problemId
  const userSubmissions = SUBMISSION.filter(submission => submission.problemId === problemId);

  // Return the user's submissions for this problem
  res.status(200).json(userSubmissions);
  res.send('Hello from route 4')
});

app.post('/submissions', function(req, res) {
  const { problemId, solution } = req.body; // Assuming problemId and solution are sent in the request body

  // Simulate random acceptance or rejection
  const isAccepted = Math.random() < 0.5; // 50% chance of acceptance

  // Store the submission in the SUBMISSION array
  SUBMISSION.push({
    problemId: problemId,
    solution: solution,
    isAccepted: isAccepted
  });

  // Return a response based on acceptance or rejection
  if (isAccepted) {
    res.status(200).send('Solution accepted!');
  } else {
    res.status(400).send('Solution rejected.');
  }
});

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  // Implement your logic to check if the user is an admin
  // For demonstration purposes, let's assume there's a user object with a 'role' property
  const user = req.user; // Assuming the user object is available in the request

  if (user && user.role === 'admin') {
    // User is an admin, proceed to the next middleware/route handler
    next();
  } else {
    // User is not an admin, return a forbidden response
    res.status(403).send('Access denied. Only admins can perform this action.');
  }
}

// Use the isAdmin middleware to protect the route
app.post('/admin/add-problem', isAdmin, function(req, res) {
  // This route is accessible only to admins
  // Add logic here to handle adding a new problem
  res.status(200).send('New problem added successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
