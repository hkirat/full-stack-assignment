const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [
{
    title: "Max element in an array",
    description: "Given an array, return the maximum of the array",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  title: "Min element in an array",
  description: "Given an array, return the minimum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "1"
  }]
}];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const requestData = req.body
  const email = requestData.email
  const password = requestData.password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(userNameAlreadyPresent(email) == true){
    res.status(400).send('Email already present. Reset password if forgotten')
  }else{
    USERS.push({email, password, isAdmin: false})
    
    // return back 200 status code to the client
    res.status(200).send('Signup successful!')
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const requestData = req.body
  const email = requestData.email
  const password = requestData.password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if(userNameAlreadyPresent(email) == false){
    res.status(400).send('Invalid email. Please signup')
  }else if(isPasswordValid(email, password) == false){
    res.status(401).send('Invalid email or password. Reset password if forgotten')
  }else{
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    res.status(200).json({
      msg: 'Login successful!',
      token: 'adfaonidfapn'
    })
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const requestData = req.body
   const email = requestData.email
   const userSubmissions = getUserSubmissions(email)
   res.status(200).json(userSubmissions)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const requestData = req.body
   const submission = requestData.submission
   SUBMISSION.push(submission)
   res.status(200).send("Submission correct")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/add_problem", function(req, res) {
  const requestData = req.body
  const question = requestData.question
  const user = requestData.user

  if(user.isAdmin == false){
    res.status(400).send('Only Admins can add new problems!')
  }else{
    QUESTIONS.push(question)
    res.status(200).send("Question added")
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

function userNameAlreadyPresent(email){
  return USERS.find((user) => user.email == email)
}

function isPasswordValid(email, password){
  return USERS.find((user) => user.email == email && user.password == password)
}

function getUserSubmissions(email){
  return SUBMISSION.filter((submission) => submission.user == user)
}

