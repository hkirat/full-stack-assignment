const express = require('express')
const app = express()
const port = 3001
const jwt = require('jsonwebtoken');
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
  const {email, password} = req.body;
  
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email, password});
  

  // return back 200 status code to the client
  res.status(200).send("User created successfully");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;


  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email && user.password === password);

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
if(user) {
  const token = jwt.sign({email},JWT_SECRET);
  res.status(200).send({token});
} else {
  res.status(401).send("Invalid credentials");
}
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.status(200).send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const solution = req.body;
  const isAccepted = Math.random() > 0.5;
  SUBMISSION.push({solution, isAccepted});

  if(accepted){
    res.status(200).send("Accepted");
  }else{
    res.status(400).send("Rejected");
  }

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("./addProblem", isAdmin, (req, res)=> {
  const {text} = req.body;
  const problem = {id: QUESTIONS.length + 1, text};
  QUESTIONS.push(problem);
  res.status(200).send("Problem added successfully");
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
}); 