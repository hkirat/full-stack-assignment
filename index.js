const express = require('express')
const app = express()
const port = 3000
const questions = [{
  questionId: 1,
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}]

const submissions = []

const users = []

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body
  const user = users.find(u => u.email === email)

  // check if the user with the given email already exists in the users array, if so return back 409 status code to the client
  if (user) {
    res.status(409).send('Email already exists')
    return
  }

  // store the email and password in the users array (only if the user with the given email doesnt exist)
  users.push({email, password})

  // return back 200 status code to the client
  res.status(200).send('Hello World from route 2!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  const user = users.find(u => u.email === req.body.email)

  // If the password is the same, return back 200 status code to the client (also send back a token, any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if(!user) {
    res.status(401).send('Invalid email or password')
    return
  }
  if (user.password === req.body.password) {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    if (req.body.email === 'admin') {
      res.status(200).send({token, admin: true})
      return
    }
    if (req.body.password === user.password) {
      res.status(200).send({token, admin: false})
    }
  }
})

app.get('/questions', function(req, res) {
  // return all the questions in the questions array
    res.status(200).send(questions)
})

app.post('/questions', function(req, res) {
  // let the user send the submission for a problem, randomly accept or reject the solution based on matching with the test cases in submissions array
  // Store the submission in the submissions array above
  // complete this
  // find the question with the given questionId
  // const question = questions.find(q => q.questionId === req.body.questionId)
  // if(!question) {
  //   res.status(404).send('Question not found')
  //   return
  // }
  const {questionID, input, output} = req.body

  const submission = {
    questionID,
    input,
    output,
    result: questions.filter(s => s.questionId === questionID).testCases.some(testCase => testCase.input === input && testCase.output === output)
  }

  submissions.push(submission)
  res.status(200).send('Submission received')
})


app.get('/submissions', function(req, res) {

  // return the user the submissions for this problem
  const submissions = submissions.filter(s => s.questionId === req.body.questionId)
  if(!submissions) {
    res.status(404).send('No submissions found')
    return
  }

  res.status(200).send(submissions)
})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
