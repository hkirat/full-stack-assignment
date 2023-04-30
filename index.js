const express = require('express')
var bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

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

  const { email, password } = req.body || {};

  
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  if (!email) {
    // If the email property is not present in the request body, return a 400 (Bad Request) status code
    return res.status(400).send('Email is required');
  }

  const userExists = USERS.some(user => user.email === email);
  if (!userExists) {
    // Store email and password in USERS array if user doesn't exist
    USERS.push({ email, password });

    // return back 200 status code to the client
    res.sendStatus(200);
  } else {
    // If user already exists, return a 409 (Conflict) status code
    res.status(409).send('User already exists');
  }


  // returns back 200 status code to the client 
 
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array

  const user = USERS.find(user => user.email === email);
  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  if (!user || user.password !== password) {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).send("Invalid email or password.");
    return;
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = "randomstring"; // replace with actual token logic
  res.status(200).json({ token: token });
})

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

