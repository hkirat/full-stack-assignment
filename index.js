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

]

app.get('/',(req,res)=> {
  res.send("Hello world");
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find((user)=> user.email === email);
  
  if(userExists){
    return res.status(404).json({error: 'A user with this email already exists!!'});
  }

  const newUser = {email,password};
  USERS.push(newUser);

  // return back 200 status code to the client
  res.sendStatus(200);
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userExists = USERS.find((user)=>{user.email === email && user.password === password});

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if(userExists){
    const token = "logged in!";
    return res.status(200).json({token});
  }
  else{
    return res.status(401).json({ error: 'Invalid email or password' });
  }


})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const submission = req.body;

  const isAccepted = Math.random() < 0.5;

  SUBMISSION.push(submission);

  if(isAccepted){
    return res.status(200).json({message: 'submission accepted!'});
  }
  else{
    return res.status(401).json({message:'submission not accepted!'});
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})