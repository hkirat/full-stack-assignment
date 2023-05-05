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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const {email, password} = req.body
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExist = USERS.some(user => user.email == email)

  if(userExist){
    res.status(409);
    res.send("User already exists")
    return;
  }

  USERS.push({email: email, password: password});
  // return back 200 status code to the client
  res.status(200)
  res.send('User created successfully')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email == emnail)

  if(!user){
    res.status(401);
    res.send("Invalid credentails")
    return;
  }
  // Also ensure that the password is the same
  if(user.password != password){
    res.status(401)
    res.send("Invalid credentails")
    return;
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token = Math.random().toString(36).substr(2);
  res.status(200)
  res.send({token});

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

  const {problemId, solution} = req.body
  const isAccepted = Math.random() < 0.5;

  const submission = {problemId,solution,isAccepted};

  if(isAccepted){
    res.send("Your submission was accepted!")
  }else{
    res.send("Your submission was accepted!")
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})