const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

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

app.post('/signup', async function(req, res) {
  try {
    // Add logic to decode body
    const { email, password } = req.body

    // body should have email and password
    if(!email || !password) {
      throw Error('Please provide your email and password!')
    }

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    if(!USERS.find(user => user.email === email)) { 
      USERS.push({ email, password })
    }

    // return back 200 status code to the client
    res.status(200)
      .json({
        message: 'Account Registered'
      })
  }
  catch(err) {
    res.status(404)
      .json({
        message: err.message
      })
  }
})

app.post('/login', async function(req, res) {
  try {
    // Add logic to decode body
    const { email, password } = req.body

    // body should have email and password
    if(!email || !password) {
      throw Error('Please provide your email and password!')
    }

    // Check if the user with the given email exists in the USERS array
    const user = USERS.find(user => user.email === email)
    if(!user) { 
      throw Error('user does not exist!')
    }

    // Also ensure that the password is the same
    if(!(user.password === password)) {
      throw Error('password is wrong')
    } 

    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client

    const token = Math.floor(Math.random() * 10000000000).toString(36)

    res.status(200)
      .json({
        message: 'Logged in successfully!',
        token
      })
  }
  catch (err) {
    res.status(401)
      .json({
        message: err.message
      })
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200)
    .json({
      QUESTIONS
    })
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.status(200)
    .json({
      SUBMISSION
    })
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})