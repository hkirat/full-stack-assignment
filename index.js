const express = require('express')
const app = express()
const port = 3001

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

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
  const {email, password} = req.body
  // body should have email and password
  if (!email || !password) {
    res.status(400).send("Email and password are required")
    return
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find(item => item.email === email)
  if (userExists) {
    res.status(409).send("User with this email already exists")
    return
  }
  USERS.push({email, password})

  // return back 200 status code to the client
  res.status(200).send("User created successfully")
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password} = req.body
  // body should have email and password
  if (!email || !password) {
    res.status(400).send("Email and password are required")
    return
  }

  // Check if the user with the given email exists in the USERS array
  const userExists = USERS.find(item => item.email === email)
  const passwordExists = USERS.find(item => item.password === password)
  if (!userExists) {
    res.status(409).send("User this email does not exists")
    return
  }
  // Also ensure that the password is the same.
  if (!passwordExists) {
    res.status(401).send("Password incorrect")
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const token = "Successfully logged in"
  res.status(200).json({token})
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.status(200).send(SUBMISSION)
});

app.post("/submissions", function (req, res) {
  const {problem, solution} = req.body
   // let the user submit a problem, randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5
   // Store the submission in the SUBMISSION array above
  SUBMISSION.push({
    problem,
    solution,
    isAccepted
  })
  res.status(200).send("Problem successfully submitted")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.