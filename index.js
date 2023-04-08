const express = require('express')
const app = express()
const port = 3001

const USERS = [
  {
    "email" : "admin@gmail.com",
    "password" : "ComplexPassword" 
  },
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
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  const { email, password } = req.body;

  if(!email||!password)
    res.status(400).send("Invalid input");

  let status = false;
  USERS.forEach((user) =>{
    if(user.email == email){
      status=true;
    }
  })
  if(status){
    res.status(200).send("User already exists");
    status=0;
  }
  else{
    USERS.push({email,password});
    res.status(200).send("New User created");
  }  
})



app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email);
  if (!user) {
    res.status(401).send("Invalid email or password");
  } else if (user.password !== password) {
    res.status(401).send("Invalid email or password");
  } else {
    const token = "wfgwagdc;g34oc834";
    res.status(200).json({ token });
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})



app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   let solution = "wdgcisgciwc";

   let status = Math.floor(Math.random() * 2) ? "Accepted" : "Rejected";
   // Store the submission in the SUBMISSION array above

   SUBMISSION.push({solution,status});
  res.status(200).json(SUBMISSION);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})