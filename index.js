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
app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    // If a user with this email already exists, send an error response
    return res.status(400).send('A user with this email already exists');
  }

  // If the email is unique, add the new user to the USERS array
  USERS.push({ email, password });


  // return back 200 status code to the client
  res.sendStatus(200);
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email);


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (!user || user.password !== password) {
    return res.status(401).send('Incorrect email or password');
  }

  
  res.status(200).json({ token });


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  const questions = QUESTIONS;
  res.status(200).json({ questions });
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem

    // Get the user's submissions for a particular problem, based on query parameters
  const problemId = req.query.problemId; // assuming the query parameter is named "problemId"
  const userSubmissions = SUBMISSIONS.filter(submission => submission.problemId === problemId);

  // Send the user's submissions as a response to the client
  res.status(200).json({ submissions: userSubmissions });


  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const { problemId, solution } = req.body;
   const randomNum = Math.random();
   const isAccepted = randomNum < 0.5;
   // Store the submission in the SUBMISSION array above
   // Create a new submission object with the problemId, solution, and acceptance status
  const newSubmission = {
    problemId,
    solution,
    isAccepted
  };

  // Add the new submission to the SUBMISSIONS array
  SUBMISSION.push(newSubmission);

  // Send a response to the client indicating whether the solution was accepted or rejected
  if (isAccepted) {
    res.status(200).json({ message: "Solution accepted" });
  } else {
    res.status(400).json({ message: "Solution rejected" });
  }

  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', function(req, res) {
  // Check if the user is an admin
  const userIsAdmin = true; // replace with your actual admin check logic

  if (!userIsAdmin) {
    // If the user is not an admin, return a 403 Forbidden response
    return res.status(403).json({ message: "Forbidden" });
  }

  // Extract the problem data from the request body
  const { title, description, difficulty } = req.body;

  // Generate a new problem ID by incrementing the current max ID in the PROBLEMS array
  const newProblemId = PROBLEMS.length > 0 ? PROBLEMS[PROBLEMS.length - 1].id + 1 : 1;

  // Create a new problem object with the extracted data and the generated ID
  const newProblem = {
    id: newProblemId,
    title,
    description,
    difficulty
  };

  // Add the new problem to the PROBLEMS array
  PROBLEMS.push(newProblem);

  // Send a response with the new problem data
  res.status(200).json(newProblem);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
