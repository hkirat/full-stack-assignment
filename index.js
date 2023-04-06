const express = require('express')
const bodyparser = require('body-parser')

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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const {username, password} = req.body
  USERS.push({username, password})


  // return back 200 status code to the client
  res.status(200).send('ok')
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
   // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  
  const {username, password} = req.body
  if(!USERS.includes(username)){
    res.status(401)
    res.send("User does not exist")
  }
  else {
  if(((password) => {
    const user = USERS.find((user) => user.username === username)
  if(user){
    return user.password
  }
  else return null
  }) === password)
  {
    res.status(200).send('ok')
    res.send({
      token : 'token'
    })
  }
}

})


app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
    const solution = req.body
    SUBMISSION.push(solution)
  });

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})