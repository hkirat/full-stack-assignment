const express = require('express')
const app = express()
const port = 3001

const USERS = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' }
];


const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

];

const PROBLEMS = [

];


app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const existingUser = USERS.find(user => user.email === email);

  if (existingUser) {
    // If the user with the given email already exists, return back 409 status code to the client
    return res.status(409).send('User already exists');
  }

  // Store email and password (as is for now) in the USERS array
  USERS.push({ email: email, password: password });

  // Return back 200 status code to the client
  res.status(200).send('User created successfully');
});



app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email && user.password === password);

  if (user) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = 'randomTokenString';
    res.status(200).json({ token: token });
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).send('Unauthorized');
  }
});

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
  // Return the user's submissions for this problem
  res.status(200).json(SUBMISSIONS);
});

app.post("/submissions", function(req, res) {
  // Add logic to handle the submission
  const { problemId, solution } = req.body;

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push({ problemId, solution });

  // Return a success response
  res.status(200).send("Solution submitted successfully");
});


app.post("/submissions", function(req, res) {
  // Add logic to handle the submission
  const { problemId, solution } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5; // 50% chance of acceptance

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push({ problemId, solution, isAccepted });

  // Return a response indicating the acceptance status
  if (isAccepted) {
    res.status(200).send("Solution accepted");
  } else {
    res.status(400).send("Solution rejected");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
// Middleware function to check if the user is an admin
function isAdmin(req, res, next) {
  // Check if the user is an admin (you can implement your own logic here)
  const isAdminUser = req.headers.authorization === 'Bearer adminToken';

  if (!isAdminUser) {
    // If the user is not an admin, return a 403 (forbidden) status
    return res.status(403).send('Forbidden');
  }

  // If the user is an admin, proceed to the next middleware or route handler
  next();
}

// Route for adding a new problem (restricted to admins)
app.post('/problems', isAdmin, function(req, res) {
  // Extract the problem details from the request body
  const { title, description } = req.body;

  // Add the new problem to the PROBLEMS array
  PROBLEMS.push({ title, description });

  // Return a success response
  res.status(200).send('Problem added successfully');
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
