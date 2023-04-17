const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');


app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

  const {email, password} = req.body
  
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  
  const existingUser = USERS.find((user) => user.email === email)

  if(existingUser){
    res.status(400).json({error: 'Email already in use'})
    return
  }

  const newUser = {email, password}
  USERS.push(newUser)
  console.log(USERS)
  res.status(200).json({message: 'User created successful'})

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password} = req.body
  // body should have email and password
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const existingUser = USERS.find((user) => user.email === email)

  if(existingUser){
    const token = jwt.sign({ email }, 'secret-key', { expiresIn: '1h' });
    existingUser.password === password 
    ?res.status(200).json({token})
    :res.status(401).json({message: "password doesn't match"})
    return
  }

  res.status(401).json({error: "unauthorized"})


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
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