const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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

app.post('/signup', function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body
  // body should have email and password
  if (!email || !password) {
    return res.status(403).json({
      message: "all fields are required"
    })
  }
  if ((USERS.some(user => user.email === email))) {
    console.log(USERS)
    return res.status(403).json({
      message: "user already exists"
    })
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({ email, password })
  // return back 200 status code to the client
  console.log(USERS)
  res.status(200).json({
    message: "user registered successfully"
  })
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  // Check if the user with the given email exists in the USERS array

  if (!(USERS.some(user => user.email === email))) {
    return res.status(403).json({
      message: "user not registered"
    })
  }
  // Also ensure that the password is the same
  else if (!(USERS.find(user => user.email === email && user.password === password))) {
    console.log((USERS.find(user => user.email === email && user.password === password)))
    return res.status(401).json({
      message: "credentials incorrect"
    })
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.status(200).json({
    message: "logged in successfully",
    token: "randomstring"

  })
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})