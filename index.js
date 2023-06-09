const express  = require('express')
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

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const email = req.body.email
  const password = req.body.password
  // body should have email and password
  if(!email || !password) {
    res.status(400).send("Email and Password are required");
    return;
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
  if(USERS.some(user=>user.email===email)){
    res.status(400).send("User with same email already exists");
    return;
  }
  USERS.push({email:email,password:password});
  
  // return back 200 status code to the client
  res.status(200).send("User created successfully");
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const email = req.body.email
  const password = req.body.password
  // body should have email and password
  if(!email || !password){
    res.status(400).send("Email and password can't be blank")
    return
  }
  // Check if the user with the given email exists in the USERS array
  const user =USERS.some(user=>user.email===email) 
  
  // Also ensure that the password is the same
  if(user && user.password===password) {
    res.status(200).send("dfbnkwefoiwejfnwl");
    return;
  }
  else{
    res.status(401).send("Invalid Credentials!");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
  return;
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION);
  return;
});


app.post("/submission", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const submission = req.query.submission;
  SUBMISSION.push(submission);
  const accepted = Math.random() < 0.5;
  if (accepted) {
    res.status(200).send('Submission accepted');
  } else {
    res.status(200).send('Submission rejected');
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})