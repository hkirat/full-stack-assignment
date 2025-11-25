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
   const {email,password} = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(!email || !password){
   res.status(404).send("please enter email and password");
 }
 let userFinding=USERS.find(users=>users.email===email);
 if(userFinding){
   res.send("you already have account using this email");
 }

 // return back 200 status code to the client
 else{
   USERS.push({email:email,password:password});
   res.status(202).send("Account created Successfully");
 }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  let {email,password}=req.body;
  if(!email || !password){
    res.status(404).send("please enter email and password");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let storedUser=USERS.find(user=>user.email===email && user.password===password);
  if(storedUser){
    res.status(200).send("login successfully");
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  else{
    res.status(401).send("We don't have any account for this combination");
  }
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