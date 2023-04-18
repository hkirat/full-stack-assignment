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


const SUBMISSIONS = [

]

const ADMINS = ['admin1', 'admin2', 'admin3']

const PROBLEMS = []

app.post('/signup', (req, res) => {
    const { email, password } = req.body

    // Check if user with given email already exists
    const userExists = USERS.some(user => user.email === email)
  
    if (userExists) {
      // Return a 409 Conflict error if user already exists
      res.status(409).send({ error: 'User with given email already exists' })
    } else {
      // Add new user to USERS array
      USERS.push({ email, password })
  
      // Return a 200 OK status code if signup was successful
      res.sendStatus(200)
    }
})

app.post('/login', (req, res) => {
    const { email, password } = req.body

    // Find user with given email in the USERS array
    const user = USERS.find(user => user.email === email)
  
    if (!user) {
      // Return a 401 Unauthorized error if user not found
      res.status(401).send({ error: 'Invalid email' })
    } 
    else if (user.password !== password) {
      // Return a 401 Unauthorized error if password is incorrect
      res.status(401).send({ error: 'Invalid password' })
    } 
    else {
      // Return a 200 OK status code if login was successful
      // Also send back a token (any random string will do for now)
      const token = Math.random().toString(36).substring(7)
      res.status(200).send({ token })
    }
})

app.get('/questions', (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", (req, res) => {
    const userId = req.query.userId
    const problemId = req.query.problemId
  
    // Filter submissions by user ID and problem ID (if provided)
    const userSubmissions = SUBMISSIONS.filter(submission => {
      if (problemId) {
        return submission.userId === userId && submission.problemId === problemId
      } else {
        return submission.userId === userId
      }
    })
  
    // Return user's submissions for the problem (if problem ID provided)
    // or all user's submissions (if no problem ID provided)
    res.send(userSubmissions)
});


app.post("/submissions", (req, res) => {
    const userId = req.body.userId
    const problemId = req.body.problemId
    const solution = req.body.solution
  
    // Randomly accept or reject the solution (50/50 chance)
    const isAccepted = Math.random() < 0.5
  
    // Create a new submission object
    const submission = { userId, problemId, solution, isAccepted, timestamp: new Date() }
  
    // Add the submission to the SUBMISSIONS array
    SUBMISSIONS.push(submission)
  
    // Return a response indicating whether the solution was accepted or rejected
    const status = isAccepted ? 'accepted' : 'rejected'
    res.send(`Your solution has been ${status}!`)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', (req, res) => {
    const userRole = req.body.role
    const problem = req.body.problem
  
    // Check if the user is an admin
    if (!ADMINS.includes(userRole)) {
      return res.status(401).send('Unauthorized')
    }
  
    // Add the problem to the PROBLEMS array
    PROBLEMS.push(problem)
  
    // Return a success response
    res.status(200).send('Problem added successfully')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
