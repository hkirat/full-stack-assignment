const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}));
app.use(express.static('public')) // For serving static files from public directory
app.use(express.json()); // For parsing application/json

const USERS = [{
  username: "james",
  email: "james6@email.com",
  password: "johndoe@100"
}];

const QUESTIONS = [{
    title: "Max of an array",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log(USERS);
})

app.post('/signup', (req, res) => {
  const {username, email, password} = req.body;

  if(!username || !email || !password) {
    return res.status(401).json({ message : 'Enter all the credentials'});
  }

  const existingUser = USERS.find(user => user.email === email);

  if(existingUser){
    return res.status(409).json({ message : 'User already exists with given email'});
  }

  USERS.push({username, email, password});
  console.log(USERS);
  return res.status(200).json({ message : 'User created successfully'});
})

app.post('/login', (req, res) => {
  const token = Math.floor(Math.random()*1000) + 'abcd' + Math.floor(Math.random()*1000);
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(401).json({message : 'Enter all the credentials'});
  }
  
  const user = USERS.find(u => u.email === email);
  console.log(user);

  if(!user){
    return res.status(401).json({ message : 'User not found'});
  }
  if(user.password === password) {
    return res.status(200).json({ message : 'Welcome back!', token});
  }else {
    return res.status(401).json({ message : 'Check the password'});
  }
})

app.get('/questions', (req, res) => {
  res.json(QUESTIONS);
})

app.get('/submissions', (req, res) => {
  res.json(SUBMISSION);
})

app.post("/submissions", (req, res) => {
   const { data } = req.body;
   const randNum = Math.floor(Math.random()*2)
   let answer
   if(randNum === 1){
    answer = "right";
   }
   else{
    answer = "wrong";
   }

   console.log(randNum);
   SUBMISSION.push(data);
   res.status(201).json({ message: "submission successful it is ", answer, data});
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
