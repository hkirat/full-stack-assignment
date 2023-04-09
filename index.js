const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

const USERS = [
  {
    email: "admin",
    password: "admin",
    isAdmin: true
  },
  {
    email: "abc",
    password: "def",
    isAdmin: false
  }
];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

// Use the body-parser middleware to parse the request body
app.use(bodyParser.json())

const SUBMISSIONS = [];

app.post('/signup', function(req, res) {
  const USERS = []
  // Add logic to decode body
  const { email, password, isAdmin } = req.body

  // Check if the user with the given email already exists
  const userExists = USERS.some(user => user.email === email)
  if (userExists) {
    // If the user already exists, return 409 Conflict status code
    res.status(409).send('User already exists!')
    return
  }

  // Store email and password in the USERS array
  USERS.push({ email, password, isAdmin })

  // Return back 200 status code to the client
  res.sendStatus(200)
});

app.post('/login', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.body

  // Find the user with the given email in the USERS array
  const user = USERS.find(user => user.email === email)

  // Check if a user was found
  if (!user) {
    // If the user doesn't exist or the password is incorrect, return 401 Unauthorized status code
    res.status(401).send('Invalid email!')
    return
  }

  // Check if the password is correct
  if (user.password !== password) {
    // If the user doesn't exist or the password is incorrect, return 401 Unauthorized status code
    res.status(401).send('Wrong password!')
    return
  }

  // If the user exists and the password is correct, generate a random token string for authentication
  const token = Math.random().toString(36).substring(7)

  // Store the token in the user object for future authentication
  user.token = token

  // Return back 200 status code to the client along with the token
  res.status(200).json({ token, isAdmin: user.isAdmin })
});


app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

// leaving as hard todos

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/questions", function(req, res) {
  // Add logic to decode body
  const { title, description, testCases } = req.body

  // Check if user is admin, then only user can submit a problem
  if(USERS[1].isAdmin){ // since we are not storing anything in DB, just checking manually out of 2 users
    // Store the submission in the SUBMISSIONS array
    QUESTIONS.push({
      title: title,
      description: description,
      testCases: testCases
    })

    // Return a response to the client
    res.status(200).send("Problem Submitted!")
  }
  // Else return not an admin
  res.status(400).send("Not an Admin!")
  
})

app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
  res.json(SUBMISSIONS);
});


app.post("/submissions", function(req, res) {
  // Add logic to decode body
  const { problem, solution } = req.body

  // Randomly accept or reject the solution
  const isAccepted = Math.random() >= 0.5

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push({ problem, solution, isAccepted })

  // Return a response to the client
  if (isAccepted) {
    res.status(200).send("Solution accepted!")
  } else {
    res.status(400).send("Solution rejected!")
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})