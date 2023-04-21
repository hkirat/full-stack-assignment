
import { generator } from "./features.js"
// const express = require('express'), this is old way, just do import 
import express from "express"

import bodyParser from 'body-parser';

import { v4 as uuidv4 } from 'uuid'

const app = express()
const port = 3000

// use body-parser middleware to get json and urlencoded data from the payload parsed to the req.body thike
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));





const users = [{
  email: "test@example.com",
  password: "testpassword",
  tokens : []
}];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSIONS = [
  {
      "questionId": 0,
      "userId": 1234,
      "answer": "[1, 2, 3, 4, 5]",
      "language": "JavaScript",
      "isAccepted": false
  }
]
app.get('/',(req,res)=>{
  res.send(`your fat percentage is ${generator()}`)
})


app.post('/signup', (req, res)=>{
  // Add logic to decode body
  // body should have email and password

  const {email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // Check if user with given email already exists, email property of user object is being compared with "email" we got from req body
  const userExists = users.some(user => user.email === email);

  //if user exists with that email 
  if (userExists) {
    return res.status(409).json({ message: 'User already exists with given email' });
  }
  // adding new user object to users array
  const newUser = { email, password };
  users.push(newUser);
  // return back 200 status code to the client
  res.status(200).json({message: "user created with success!"})
})

app.post('/login', (req, res)=> {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body
  // // Check if the user with the given email exists in the USERS array
  // // Also ensure that the password is the same
  const user = users.find((user) => user.email === email);
  if (!user) {
        res.status(401).send('Invalid email or password');
      } else if (user.password !== password) {
        res.status(401).send('wrong password');
      } else {
        const token = uuidv4();
        user.tokens.push = token;
        res.status(200).json({ message: 'Login successful', token });
      }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', (req, res)=> {
  res.status(200).json({ questions: QUESTIONS });
  //return the user all the questions in the QUESTIONS array
})

app.get("/mysubmissions", (req, res)=> {
   const {userId}= req.body
   const sub = SUBMISSIONS.find((subs)=> subs.userId === userId)
   if(sub)
   {
    res.status(200).json({sub})
   }
   else {
    res.status(404).json({message:"no submission found"})
   }
  res.send("Hello World from route 4!")
});


app.post("/submissions", (req, res)=> {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { questionId, userId, answer, language } = req.body;

   const isAccepted = Math.random() >= 0.5; // if more than 0.5 true else false

   // creating new submission oject 
   const submission = { questionId, userId, answer , language,isAccepted }

   //adding it to submissions array
   SUBMISSIONS.push(submission);

   res.status(200).json({submission})
  
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/postproblem",(req,res)=>{
  const {user} = req.body
  if(user.role !== "admin")
  {
    return res.status(401).json({error:'Unauthorized'})
  }
  else
  {
    const newId = QUESTIONS.length + 1;
    const newProblem = {
      id: newId,
      title: req.body.title,
      description: req.body.description,
      testCases: req.body.testCases
  };
  QUESTIONS.push(newProblem)
  res.status(200).json({message: "Problem added successfully", problem: newProblem});
  }
})
app.listen(port, ()=> {
  console.log(`Example app listening on port ${port}`)
})