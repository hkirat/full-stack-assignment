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


const SUBMISSION = [
{

}
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

 const {email,pwd} = req.body;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
if(!USERS.some(userentry => userentry.email ==email)){
  USERS.push({email,pwd});
}

  // return back 200 status code to the client
  res.status(200).send("Hello world");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,pwd} = req.body;
  // Check if the user with the given email exists in the USERS array
  const userexist = USERS.some(entry=>entry.email==email);
  const pwdMatch = USERS.some(entry=>entry.pwd==pwd);
  if(!userexist){
    res.status(401).send("User not found");
  }

  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  if(pwdMatch){
    res.send(200).status("Password match");
  }
  else{
    res.status(401).send("Password do no match");
  }

  res.status.send("This is some random string");
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client



})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS[0].description);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const accept = Math.random() >0.5;
   // Store the submission in the SUBMISSION array above
   if(accept){
    SUBMISSION.push("Code accept")
   }
   else{
    SUBMISSION.push("Code Reject");
   }
   
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})