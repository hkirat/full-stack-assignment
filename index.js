const express = require('express');
const app = express();
const port = 3000;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5"
      }
    ]
  }
];

const SUBMISSIONS = [];

app.use(express.json()); // Middleware to parse JSON request bodies

// Signup route
app.post('/signup', function (req, res) {
  const { email, password } = req.body; // Assuming the request body contains email and password
  
  // Check if a user with the given email already exists
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  // Add the new user to the USERS array
  USERS.push({ email, password });

  return res.status(200).send("User registered successfully");
});

// Login route
app.post('/login', function (req, res) {
  const { email, password } = req.body; // Assuming the request body contains email and password
  
  // Find the user with the given email
  const user = USERS.find(user => user.email === email);

  if (!user || user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  // Generate a token (for simplicity, using a random string)
  const token = Math.random().toString(36).substr(2);
  
  return res.status(200).json({ token }); // Return token as JSON response
});

// Questions route
app.get('/questions', function (req, res) {
  return res.status(200).json(QUESTIONS); // Return QUESTIONS array as JSON response
});

// Submissions route
app.post('/submissions', function (req, res) {
  const submission = req.body; // Assuming the request body contains the submission object
  
  // Randomly accept or reject the submission (for simplicity)
  const isAccepted = Math.random() < 0.5;
  submission.status = isAccepted ? "Accepted" : "Rejected";
  
  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push(submission);

  return res.status(200).json(submission); // Return submission status as JSON response
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
