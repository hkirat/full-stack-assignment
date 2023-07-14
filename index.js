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

// const express = require('express');
// const app = express();

app.use(express.json()); // Middleware for parsing JSON request bodies

app.post('/signup', function(req, res) {
  const { email, pass } = req.body;
  if (!email || !pass) {
    res.send("Email and password required");
    return; // End the function execution
  }

  // Check if email already exists
  const present = USERS.find(user => user.email === email);
  if (present) {
    res.send("Email already exists");
    return; // End the function execution
  }

  // Store email and password in the USERS array
  USERS.push({ email, pass });

  res.sendStatus(200); // Return a 200 status code to the client
});



app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  if (!user || user.password !== password) {
    // If the user doesn't exist or the password doesn't match, return 401 status code
    res.status(401).send("Authentication failed");
    return;
  }

  // If the password matches, generate a token (random string)
  const token = generateToken();

  // Return 200 status code and the token to the client
  res.status(200).json({ token });
});


app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.json(SUBMISSION);
   res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
  // Extract the submission data from the request body
  const { userId, problemId, code } = req.body;

  // Generate a random boolean value to determine acceptance
  const isAccepted = Math.random() < 0.5; // Adjust the threshold as needed

  // Create a new submission object
  const submission = {
    userId: userId,
    problemId: problemId,
    submissionId: SUBMISSION.length + 1, // Generate a unique submissionId
    code: code,
    isAccepted: isAccepted
  };

  // Store the submission in the SUBMISSION array
  SUBMISSION.push(submission);

  // Send the response
  res.send("Submission successful!");
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})