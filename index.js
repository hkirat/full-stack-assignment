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

app.post('/signup', (req, res) => {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("An email and password is required.")
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
  const userExists = USERS.find((user) => user.email === email)

  if (userExists) {
    res.status(400).send("This email address has been taken.")
  } else {
    USERS.push({ email, password} )
  }


  // return back 200 status code to the client
  res.status(200).send('Successfully created account!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password} = req.body

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const userExists = USERS.find((user) => user.email === email)


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if (userExists && USERS.password === password) {
    res.status(200).send("Successfully logged in! token: fdskaljfkl")
  } else {
    res.status(401).send("Incorrect username or password.")
  }
})

app.get('/questions', function(req, res) {

  //return to the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const { problem, submission } = req.body

  answer = Math.random()

  if (answer === 0)  {
    accepted = true
  } else { 
    accepted = false
  }

  SUBMISSION.push({problem, submission, accepted})

  res.status(200).send( {status: accepted ? "accepted": "rejected"} )
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})