const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

let Id=[];
let acceptanceStatus;
const USERS = [];

app.use(bodyParser.urlencoded({extended: true }));

const QUESTIONS = [{
    problemId:1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.post('/signup', (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !password || !username) {
    return res.status(400).send('Email and password required');
  }

  if (checkUser(email,username)>-1) {
    return res.status(409).send('User with email or username already exists');
  }

  USERS.push({ email, username, password });
  return res.status(201).send('User created successfully. Login in order to collect your userId');
});

app.post('/login', function(req, res) {
  const email = req.body.email;
  const username =req.body.username;
  const password = req.body.password;
  if ((!email && !username)|| !password) {
    return res.status(400).send('Email or username and password required');
  }
  checkUserName=(checkUser(email,username))
  if (checkUserName===-1) {
    return res.status(401).send('Invalid email or password');
  }
  if (!USERS[checkUserName][password]===password) {
    return res.status(401).send('Invalid email or password');
  }
  let UserIndex=USERS.findIndex(user => user.email === email);
  const token = Math.random().toString(36).substring(7);
  Id[UserIndex]=token;
  res.status(200).send(`Welcome User ${username} Here is your userId "${token}"`);
});

function checkUser(email,username) {
  return USERS.findIndex((user) => user.email === email || user.username === username);}


function checkIndexOfId(userId) {
  return Id.indexOf(userId);
}

app.get('/questions', function(req, res) {
  const userId=req.body.userId,problemId=req.body.problemId;
  if(checkIndexOfId(userId)>-1){
  return res.status(200).json(QUESTIONS[problemId-1]);}
  return res.status(401).send('Login First and collect your userId')
});

app.get("/submissions", function(req, res) {
  const userId = req.body.userId,problemId=req.body.problemId,username=req.body.username;
  if(checkIndexOfId(userId)>-1){
  const userSubmissions = SUBMISSION.filter(submission => submission.problemId == problemId && submission.userName === username);
if(!(userSubmissions === undefined || userSubmissions.length == 0)){
  return res.status(200).json(userSubmissions);}
  else{return res.status(200).send('No Such Submission Exists')}
  return res.status(401).send('Login First and collect your userId')}
});



app.post("/submissions", function(req, res) {
  const userId=req.body.userId, problemId=req.body.problemId, solution = req.body.solution;
  userName=USERS[checkIndexOfId(userId)].username;
  if (checkIndexOfId(userId)>-1)
  {
    const isAccepted = Math.random() < 0.5;
if (isAccepted){acceptanceStatus="Accepted";}
else{acceptanceStatus="Rejected";}
  const newSubmission = {
    userName,
    problemId,
    solution,
    acceptanceStatus
  };
  indexOfProblem = SUBMISSION.findIndex(submission => submission.problemId === problemId && submission.userName === userName);
    if(indexOfProblem>-1){
  SUBMISSION[indexOfProblem]=newSubmission;  
}
  else{SUBMISSION.push(newSubmission);}
  return res.status(200).json(newSubmission);}
  return res.status(401).send('Login First and collect your userId')
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})