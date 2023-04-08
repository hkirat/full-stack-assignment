// Import required modules
const express = require('express')
const bodyParser = require('body-parser')

// Create an instance of express app
const app = express()

//Port details
const port = 3001

const tokenLength = 16;

const USERS = [];

const QUESTIONS = [{
    id: "1",
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSIONS = [{
  email:"",
  questionId: "1",
  solution: "",
  result: "",
  accepted: ""
}]

// Use the bodyParser middleware to parse incoming request bodies
app.use(bodyParser.json())

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  addUser(email, password);

  // return back 200 status code to the client
  res.status(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (!isExistingUser(email)) {
    res.status(401);
    return;
  }

  // If the password is not the same, return back 401 status code to the client
  if (!isPasswordValid(email, password)) {
    res.status(401);
    return;
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = getToken();
  res.status(200).json({ token: token });
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const email = req.body.email;
  const questionId = req.body.questionId;

  submissions = getSubmissions(email, questionId);
  res.status(200).json(submissions);
});


app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { email, questionId, solution, result, accepted } = req.body;

  if (!shouldAcceptSolution()) {
    req.status(200).send("Solution not accepted");
  }
  res.status(200).send("Solution is accepted");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

function addUser(email, password) {
  // Add user
  if (!isExistingUser(email)) {
    USERS.push([email, password]);
  }
}

function isExistingUser(email) {
  for (const user of USERS) {
    if (user[0] == email) {
      return true;
    }
  }
  return false;
}

function isPasswordValid(email, password) {
  // Validate password
  for (const user of USERS) {
    if (user[0] == email) {
      if (user[1] == password) {
        return true;
      }
    }
  }
  return false;
}

function getToken() {
  return generateRandomString(tokenLength);
}

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function getSubmissions(email, problemId) {
  return SUBMISSIONS.filter(
    submission => 
    submission.email === email &&
    submission.problemId === problemId
  )
}

function shouldAcceptSolution() {
  return randomBoolean();
}

function randomBoolean() {
  return Math.random() >= 0.5;
}