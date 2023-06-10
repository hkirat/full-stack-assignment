const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const USERS = [];

const QUESTIONS = [{
    id: 1,
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
  let alreadyExists = false;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  for (i = 0; i < USERS.length; i++) {
    if (USERS[i].email == email) {
      alreadyExists = true
      res.status(409).send('Email already exists')
      break;
    }
  }

  if (!alreadyExists) {
    USERS.push({
      email: email,
      password: password
    })
  
    // return back 200 status code to the client
    res.status(200).send('Success')
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  const token = "eyXYZ"
  let isAuth = false

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  for (i = 0; i < USERS.length; i++) {
    if (USERS[i].email == email) {
      if (USERS[i].password == password) {
        isAuth = true
        // Set the token as a response header
        res.setHeader('Authorization', `Bearer ${token}`);
        res.sendStatus(200);
        break;
      }
    }
  }

  // Authentication fails either when user does not exist or password does not match
  if (!isAuth) {
    res.status(401).send('Authentication Failed')
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
  const {userEmail, problemID} = req.body
  let response = []

  for (i = 0; i < SUBMISSION.length; i++) {
    if (SUBMISSION[i].userID == userEmail && 
      SUBMISSION[i].problemID == problemID) {
      response.push(SUBMISSION[i])
    }
  }

  if (response.length == 0) {
    res.status(404).send('Not Found')
  }
  else {
    res.json(response)
  }
});


app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const {userEmail, problemID} = req.body
  let verdict = Math.floor(Math.random() * 10) % 2 == 0;

  let submissionObj = {
    userID: userEmail,
    problemID: problemID,
    submissionID: SUBMISSION.length,
    verdict: verdict
  }

  SUBMISSION.push(submissionObj)
  res.sendStatus(200)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})