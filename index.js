const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001

const USERS = [];
var Id;
let acceptanceStatus;

app.use(bodyParser.urlencoded({extended: true }));

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,6]",
        output: "6"
    }],
    title: "Two states",
    description: "Given an array , return the min of the array?",
    testCases: [{
        input: "[1,2,3,4,6]",
        output: "1"
    }],
 }];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
 {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Email and password required');
  }

  if (checkUserExistence(email,password)) {
    return res.status(409).send('User with email and password already exists');
  }

  USERS.push({ email, password });
  return res.status(201).send('User created successfully. Login in order to collect your userId');
}
  // res.send('Hello World!')
})

app.post('/login', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('Email and password required');
  }
  if (!(checkUserExistence(email,password))) {
    return res.status(401).send('Invalid email or password');
  }
  const token = Math.random().toString(36).substring(7);
  Id=token;
  res.status(200).send(`Here is your userId "${token}"`);
})
function checkUserExistence(email,password) {
  return USERS.some((user) => user.email === email && user.password === password);}

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array

   const userId=req.body.userId;
  if(userId===Id){
  return res.status(200).json(QUESTIONS);}
  return res.status(401).send('Login First and collect your userId')
  // res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
  const userId = req.body.userId,problemId=req.body.problemId;
  if(userId===Id){
  const userSubmissions = SUBMISSION.filter(submission => submission.problemId === problemId);

if(!(userSubmissions === undefined || userSubmissions.length == 0)){
  return res.status(200).json(userSubmissions);}
  else{return res.status(200).send('No Such Submission Exists')}
  return res.status(401).send('Login First and collect your userId')}
});



app.post("/submissions", function(req, res) {
  const userId=req.body.userId, problemId=req.body.problemId, solution = req.body.solution;
  if (userId===Id)
  {
    const isAccepted = Math.random() < 0.5;
if (isAccepted===true){acceptanceStatus="Accepted";}
else{acceptanceStatus="Rejected";}
  const newSubmission = {
    userId,
    problemId,
    solution,
    acceptanceStatus
  };
    const problemIdCheck = SUBMISSION.some(submission => submission.problemId === problemId);
    if(problemIdCheck){
  indexof = SUBMISSION.findIndex(submission => submission.problemId === problemId)
  SUBMISSION[indexof]=newSubmission;  
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