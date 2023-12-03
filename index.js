const express = require('express')
const app = express()
const parser = require('body-parser')
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


const SUBMISSION = [

]

app.use(express.json())

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  const {email, password} = req.body;
  const user = USERS.find(u => u.email === email && u.password === password);
  if(!user) {
     newUser = {email, password};
     USERS.push(newUser)
     return res.status(200).send("registered")
  } else {
    return res.status(400).send('Email already exist')
  }
``
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const {email, password} = req.body;
  const user = USERS.find((u) => user.email === email);
  if(!user){
    return res.sendStatus(401).json({message: "not a registered user"})
  }
  const isCorrect = password === user.password;
  if(!isCorrect) {
    return res.sendStatus(401).json({message: "Wrong Password"});
  }
  const token = "done";
  res.send(token)
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.sendStatus(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
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