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

const PROBLEMS = [

]

app.post('/signup', function(req, res) {
  const {email, password} = req.body;
  const userExists = USERS.some(user => user.email === email);
  if (!userExists) {
    users.push({email: email, password: password});
    return {status: 200, message: 'Registration successful!'};
  } else {
    return {status: 401, message: 'User already exists!'};
  }
})

app.post('/login', function(req, res) {
  const {email, password} = req.body;
  const user = users.find(user => user.email === email);
  if(!user){
      return {status: 401, message: "email doesn't exist!"};
  }else if (password !== user.password){
      return {status: 401, message: "Invalid password!"};    
  }else {
      return {status: 200, message: "Logged In Successfully!", token: "User Founded $HDEHW786BC76887678"};    
  }
})

app.get('/questions', function(req, res) {
    res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   res.status(200).json(SUBMISSION);
});

function acceptOrRejectSolution() {
  const randomNum = Math.floor(Math.random() * 2);
   if (randomNum === 0) {
    return "rejected";
  } else {
    return "accepted";
  }
}


app.post("/submissions", function(req, res) {
  const { problem, solution } = req.body;
  const status = acceptOrRejectSolution();
  SUBMISSIONS.push({ problem, solution, status });
  res.status(200).json({ status, message: "Submission received." });
});

app.post('/problems', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { text } = req.body;
  const id = PROBLEMS.length + 1;
  const newProblem = { id, text };
  PROBLEMS.push(newProblem);
  res.status(201).json(newProblem);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
