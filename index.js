const express = require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
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

  const { email, password, isAdmin } = req.body;
  
  if (!email || !password) {
    res.status(400).send("Email or password is incorrect");
    return;
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const userFound = USERS.find(user => user.email === email);
  if(userFound) {
    res.status(400).send("Already Exists");
    return ;
  }

  const admin = isAdmin ? true : false;
  USERS.push({email, password, admin});

  // return back 200 status code to the client
  // res.send('Hello World!')
  res.status(200).send('User created successfully')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Invalid Credentials");
    return;
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const userFound = USERS.find(user => user.email === email);
  if(!userFound) {
    res.status(401).send("User does not Exists!");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if(userFound.password !== password) {
    res.status(401).send("Incorrect Password");
    return ;
  }
  const token = Math.random().toString(36).substring(5);
  res.status(200).json({ message: 'User logged in successfully', token });
  // res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ message: 'Success', questions: QUESTIONS });
  // res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const { question } = req.body

  if (!question) {
    res.status(400).send("Question not Found");
    return;
  }

  const submissions = SUBMISSION.filter(sub => sub.question == question);

  if (!submissions) {
    res.status(400).send("No submissions found!");
    return;
  }

  res.status(200).json({ message: 'Success', submissions });
  // res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { question, solution } = req.body;
   if (!question || !solution) {
    res.status(400).send("Question or solution is missing");
    return;
  }

  const Qstatus = Math.random() > 0.5;
  SUBMISSION.push({ question, solution, Qstatus });
  res.status(200).json({ message: `Solutions is ${Qstatus}` });
  // res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin",function(req,res) {
  const email = req.body.email;

  const userFound = USERS.find(user => user.email === email);

  if(!userFound || userFound.admin === false) {
    res.status(401).send("No Access");
    return;
  }

  const { title, description, testCases } = req.body;

  QUESTIONS.push({
    title,
    description,
    testCases,
  });

  res.status(200).send("Problem added successfully");
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})