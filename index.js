const express = require('express');
const app = express();
const port = 3001;


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


app.use(express.json()); // Middleware to parse JSON request bodies


app.get('/', function(req, res) {
  res.send('Welcome to the application!');
});


app.post('/signup', function(req, res) {
  const { email, password } = req.body;


  const existingUser = USERS.find(user => user.email === email);


  if (existingUser) {
    res.status(409).send('User already exists');
  } else {
    const newUser = {
      email,
      password
    };
    USERS.push(newUser);


    res.status(200).send('Signup successful');
  }
});


app.post('/login', function(req, res) {
  const { email, password } = req.body;


  const user = USERS.find(user => user.email === email);


  if (!user) {
    res.status(401).send('Invalid credentials');
  } else {
    if (user.password === password) {
      const token = generateRandomToken();


      res.status(200).json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  }
});


app.get('/questions', function(req, res) {
  res.status(200).json(QUESTIONS);
});


app.get("/submissions", function(req, res) {
  const userId = req.user.id; // Assuming you have the user ID available in the request object


  const userSubmissions = SUBMISSIONS.filter(submission => submission.userId === userId);
  res.status(200).json(userSubmissions);
});


app.post("/submissions", function(req, res) {
  const userId = req.user.id; // Assuming you have the user ID available in the request object


  const result = Math.random() < 0.5 ? "accept" : "reject";


  const newSubmission = {
    userId,
    data: req.body.data,
    result
  };


  SUBMISSIONS.push(newSubmission);


  res.status(200).send("Submission successful");
});


// Middleware function for checking admin role
function checkAdminRole(req, res, next) {
  // Check if the user is authenticated and has the "admin" role
  if (req.isAuthenticated() && req.user.role === 'admin') {
    // User is authenticated and has the "admin" role, proceed to the next middleware or route handler
    next();
  } else {
    // User is either not authenticated or does not have the "admin" role, send a 403 Forbidden status code
    res.status(403).send('Access denied');
  }
}


// Route for adding a new problem accessible only to admins
app.post('/problems', checkAdminRole, function(req, res) {
  // Logic for adding a new problem goes here
  res.status(200).send('Problem added successfully');
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});


function generateRandomToken() {
  // Implement your token generation logic here
  // Return a randomly generated token
}
