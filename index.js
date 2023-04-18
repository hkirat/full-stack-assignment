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
  const { email, password } = req.body;

  // Check if a user with the given email already exists
  const userExists = USERS.find(user => user.email === email);

  // If user already exists, return an error response
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Add new user to the USERS array
  USERS.push({ email, password });

  // Return a success response
  return res.status(200).json({ message: 'User registered successfully' });
 
})

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if a user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  // If user does not exist, return a 401 error response
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check if the password is the same
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // If the password is the same, return a success response with a token
  const token = 'any random string'; // Generate a random string for the token
  return res.status(200).json({ message: 'Login successful', token });
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  const title = QUESTIONS.map((q) => q.title);
  const desc = QUESTIONS.map((q) => q.description);
  const testCases = QUESTIONS.map((q) => q.testCases);
  res.json({ title, desc, testCases });
})

app.get("/submissions", function(req, res) {
  res.json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   const {problemId, solution} = req.body;
   const isAccepted = Math.random() < 0.5;
   const submission = {problemId, solution, isAccepted};
   if(!isAccepted) {
    SUBMISSION.push([...submission]);
    res.status(201).send("submission Accepted");
   }else {
    res.status(400).send("submission Rejected");
   }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})