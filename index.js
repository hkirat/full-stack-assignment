const express = require('express');
const bodyParser=require('body-parser');
const emailValidator=require('email-validator');
const sanitizeHtml=require('sanitize-html');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const app = express()
const port = 3001
app.use(bodyParser.urlencoded({extended:true}));

const USERS = [
  {
    email:'admin@gmail.com',
    password:'1234',
    role:'admin'
  }
];

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
        // using santizeHtml to remove any html content from email and password to prevent security vulnerabilities
      const password=sanitizeHtml(req.body.password);
      const email=sanitizeHtml(req.body.email);
      
      if(!emailValidator.validate(email)){
        res.status(400).send('Invalid email address');
      }
      if(password.length<8){
        return res.status(400).send('Password must be 8 characters long');
      }
        // Hash password before storing it
        const saltsRound=10;
        const hashPassword= bcrypt.hash(password,saltsRound);
        // Add logic to decode body
        // body should have email and password
      
      const existingUser=USERS.find(user=>user.email===email);
      
        //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
      if(existingUser){
        return res.status(400).send('User with this email already exist');
      }
      
        USERS.push({email:email, password:hashPassword});
        res.status(200).send("User created Successfully");
      
        // return back 200 status code to the client
        // res.send('Hello World!');
});



app.post('/login', function(req, res) {
  // (Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client)

      const email=sanitizeHtml(req.body.email);
      const password=sanitizeHtml(req.body.password);
       // Check if email and password are valid
      if(!email || !password){
        return res.status(400).send('invalid email or password');
      }
      const user=USERS.find(user=>user.email===email);
      if(!user){
        return res.status(401).send('unauthorized');
      }
      const isPasswordCorrect= bcrypt.compare(user.password,password);
      if(!isPasswordCorrect){
        return res.status(401).send('unauthorized');
      }
      const token=jwt.sign({email:email},'secret');
      res.json({token:token});
        // res.send('Hello World from route 2!');
      });



app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
  // res.send("Hello World from route 3!");
});

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.send(SUBMISSION);
  // res.send("Hello World from route 4!");
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
const {problemId,solution} = req.body;
const isAccepted=math.random()<0.5;  //randomly accept or reject solution

const newSubmission={     // Create a new submission object
  id:SUBMISSION.length+1,
  problemId:problemId,
  solution:solution,
 isAccepted:isAccepted
}
SUBMISSION.push(newSubmission);  // Add the new submission to the SUBMISSIONS array
if(isAccepted)res.status(200).send("solution accepted");
else res.status(400).send("solution rejected");
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/problem',function(req,res){
  const email=req.body.email;
  const user=USERS.find(user=>user.email==email)  //Recheck this part of code
  if (!user || user.role !== "admin") {
    return res.status(403).send("Unauthorized");
  }
const {title,description,testcases}=req.body;
const newProblem={
  id:QUESTIONS.length+1,
title:title,
description:description,
testcases:testcases
}
QUESTIONS.push(newProblem);
res.status(200).send('problem created successfully');
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})