const express = require('express')
const app = express()
const port = 3000

// Array to hold registered users
const USERS = []

// Array to hold questions
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

// Array to hold user submissions
const SUBMISSIONS = []

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/signup', function(req, res) {
  // Decode the email and password from the request body
  const { email, password } = req.body

  // Check if user with the email already exists
  const userExists = USERS.find(user => user.email === email)

  if (userExists) {
    // If user with email already exists, return a 409 conflict status code
    res.status(409).send('User with email already exists')
  } else {
    // If user with email does not exist, add user to USERS array
    USERS.push({ email, password })

    // Return a 200 status code to the client
    res.sendStatus(200)
  }
})

app.post('/login', function(req, res) {
  // Decode the email and password from the request body
  const { email, password } = req.body

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email)

  if (!user) {
    // If user with email does not exist, return a 401 unauthorized status code
    res.status(401).send('User with email does not exist')
  } else if (user.password !== password) {
    // If password is incorrect, return a 401 unauthorized status code
    res.status(401).send('Incorrect password')
  } else {
    // If email and password are correct, generate a random token
    const token = Math.random().toString(36).substr(2)

    // Send the token and a 200 status code back to the client
    res.status(200).json({ token })
  }
})

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.post('/submissions', function(req, res) {
  // Decode the submission from the request body
  const { problem, solution } = req.body

  // Generate a random boolean to determine if the submission is accepted or rejected
  const isAccepted = Math.random() < 0.5

  // Add the submission to the SUBMISSIONS array
  SUBMISSIONS.push({ problem, solution, isAccepted })

  // Send a response to the client with the acceptance status
  if (isAccepted) {
    res.status(200).send('Submission accepted')
  } else {
    res.status(403).send('Submission rejected')
  }
})

// I implemented the logic that the admin's username will contain the string "admin" and used it to seperate the admin from the regular username

app.post('/admin/questions', function(req, res) {
    // Add logic to decode body
    // body should have question and answer fields
    
    // Check if the user making the request is an admin
    if (!req.user || !req.user.username || !req.user.username.includes('admin')) {
      return res.status(401).send('Only admins are allowed to add new questions')
    }
    
    // If the user is an admin, add the new question to the QUESTIONS array
    QUESTIONS.push({
      question: req.body.question,
      answer: req.body.answer
    })
    
    // return back 200 status code to the client
    res.send('Question added successfully')
  })
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
