const express = require('express')
const app = express()
const port = 3001

app.use(express.json()); // for reading json input properly

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

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find(u => u.email === email);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  USERS.push({ email, password });
  // return back 200 status code to the client
  res.status(200).json({ message: "User signup successfully " });
});

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(u => u.email === email);

  if (!user) {
    res.status(401).json({ message: "User not found" });
  }
  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = Math.random().toString();
  res.status(200).json({ message: "Login successful", token });
});

app.get('/questions', function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const {email, problemTitile, solution } = req.body;

  const accepted = Math.random() > 0.5;
  
  const submission = {
    email,
    problemTitile,
    solution,
    status: accepted ? "Accepted" : "Rejected"
  };

  SUBMISSION.push(submission);

  res.status(200).json(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})