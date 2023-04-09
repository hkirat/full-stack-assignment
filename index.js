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
  {
    id: 1,
    userId: 1,
    problemId: 1,
    code: "function add(a, b) { return a + b; }",
    language: "javascript",
    status : "Accepted"
  },
  {
    id: 2,
    userId: 2,
    problemId: 1,
    code: "def subtract(a, b):\n  return a * b",
    language: "python",
    status: "Wrong Answer"
  }

];

// middleware function to parse JSON 
app.use(express.json());  

app.post('/signup', function(req, res) {
 
  const {email , password } = req.body;

  // check if email and password are provided
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  // to check if the user exists
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    return res.status(409).send('User already exists');
  }

  // push the new user to USERS
  const newUser = { email, password };
  USERS.push(newUser);

  // success message
  return res.status(200).send('User created successfully');
});

app.post('/login', function(req, res) {

  const { email, password } = req.body;

  // check if email and password are provided
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  // Check if user with given email exists and password is correct
  const user = USERS.find(user => user.email === email);
  if (user && user.password === password) {
    // Generate a random token and send it back to the client
    const token = Math.random().toString(36).substring(7);
    return res.status(200).json({ token });
  }

  // If user doesn't exist or password is incorrect, return a 401 status code
  return res.status(401).send('Invalid email or password');
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  return res.status(200).send(QUESTIONS);
});

app.get("/submissions", function(req, res) {

  // Find all submissions for the current user and problem
  const userId = req.params.id; // Assuming user ID is stored in the req.user object
  const problemId = req.query.problemId; // Assuming problem ID is passed as a query parameter
  const userSubmissions = SUBMISSION.
  filter(submission => submission.userId === userId && submission.problemId === problemId);

  // Return the submissions to the client
  return res.status(200).send(userSubmissions);

});

app.post("/submissions", function(req, res) {
   // Get the submission data from the request body
  const { userId, questionId, solution } = req.body;

  // random acceptance or rejection of the solution
  const isAccepted = Math.random() < 0.5 ? "Accepted" : "Wrong Answer";

  // Create a new submission object
  const submission = { userId, questionId, solution, isAccepted };

  // Store the submission in the SUBMISSION array
  SUBMISSION.push(submission);

  // Send a response back to the client
  return res.status(201).json({ message: "Submission created successfully", submission });

});


// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const admin = "admin";
app.post("/problems" , function(req , res) {

  const username = req.headers.username;
  const isAdmin = admin === username;

  // Check if the user is an admin
  if (!isAdmin) {
    return res.status(401).json({ error: "Only admins can add problems" });
  }

  // Get the new problem data from the request body
  const { title, description, testCases } = req.body;

  // Create a new problem object
  const problem = { title, description, testCases };

  // Add the new problem to the QUESTIONS array
  QUESTIONS.push(problem);

  // Send a response back to the client
  return res.status(201).json({ message: "Problem created successfully", problem });
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})