const express = require('express')
const app = express()
const port = 3001
app.use(express.json())

const USERS = [
  {
    email: "admin@test.com",
    password: "test",
    isAdmin: true
  },
  {
    email: "abc@test.com",
    password: "password",
    isAdmin: false
  },
  {
    email: "xyz@text.com",
    password: "passxyz",
    isAdmin: false
  },
  {
    email: "pqr@test.com",
    password: "passpqr",
    isAdmin: false
  }
];

const TOKENS = {};

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
    email: "abc@test.com",
    questionTitle: "Two states",
    code: "func max(arr) {return Math.max(...arr)}",
    status: "accepted"
  },
  {
    email: "abc@test.com",
    questionTitle: "Two states",
    code: "func max(arr) {return Math.min(...arr)}",
    status: "rejected"
  },
  {
    email: "xyz@test.com",
    questionTitle: "Two states",
    code: "func max(arr) {return Math.max(...arr)}",
    status: "accepted"
  },
  {
    email: "pqr@test.com",
    questionTitle: "Two states",
    code: "func max(arr) {return Math.min(...arr)}",
    status: "rejected"
  }
]

//middleware funcs
const isAuthenticated = (req, res, next) => {
  const {token} = req.body
  
  if (!(token in TOKENS)){
    res.redirect('/login')
  }
  else{
    return next();
  }
}

const isAdmin = (req,res,next) => {
  const {token} = req.body
  const email = TOKENS[token]
  let result = false;
  for (let i=0; i<USERS.length; i++){
    if(USERS[i].email === email && USERS[i].isAdmin){
      result = true
    }
  }
  if(result){
    next();
  }
  else{
    res.send('Insufficient privileges')
  }
}

app.post('/signup', function(req, res) {
  // Add logic to decode body  
  // body should have email and password
  const {email, password, isAdmin = false} = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let exists = false
  for (let i=0; i<USERS.length; i++){
    if (USERS[i].email === email){
      exists = true
      break;
    }
  }
  if (exists){
    res.send('User already exists');
    return;
  }

  USERS.push({email, password, isAdmin});

  // return back 200 status code to the client
  res.status(200).send("OK");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let valid = false
  for (let i=0; i<USERS.length; i++){
    if(USERS[i].email === email && USERS[i].password === password){
      valid = true;
      break;
    }
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (!valid){
    res.status(401).send("INVALID CREDENTIALS");
    return;
  }
  const token = Math.random().toString(36).substring(2);
  TOKENS[token] = email; 

  res.status(200).send(token);
})

app.get('/questions', isAuthenticated, function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", isAuthenticated, function(req, res) {
  const {token, questionTitle} = req.body;
  const email = TOKENS[token];
  
  // return the users submissions for this problem
  let submissions = [];
  for(let i=0; i<SUBMISSION.length; i++){
    if(SUBMISSION[i].email === email && SUBMISSION[i].questionTitle === questionTitle){
      submissions.push(SUBMISSION[i]);
    }
  }
  res.send(submissions);
});

app.post("/submissions", isAuthenticated, function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above 
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/questions', isAuthenticated, isAdmin, function(req, res) {
  const { title, description, testCases } = req.body;
  QUESTIONS.push({title, description, testCases});
  //allow admin user to create and post a question
  res.status(200).send('OK');
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})