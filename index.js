const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const PASSWORDS = new Map();

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSIONS = [
  // { id: 1, userId: 123, problemId: 456, solution: "Some solution code" },
  // { id: 2, userId: 789, problemId: 456, solution: "Another solution code" },
  // More submissions...
];

//This route is for the signup page of our app
app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(USERS.find(user => user.email === email) === undefined){
    USERS.push({email, password});
  }

  // return back 200 status code to the client
  //res.send('Hello World!')
  res.status(200).send("Signup Successful!");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;

  const user = USERS.find(user => user.email === email);

  if(!user){
    return res.status(401).json({message: "Invalid username or password"});
  }

  if(user.password !== password){
    return res.status(401).json({message: "Invalid username or password"});
  }

  //Successful login
  res.status(200).send("Login successful!");

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  //res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  //res.send("Hello World from route 4!")
  // Filter submissions based on the problem ID or any other criteria
  const problemId = req.query.problemId; // Assuming problemId is passed as a query parameter
  const filteredSubmissions = SUBMISSIONS.filter(submission => submission.problemId === problemId);
  res.send(filteredSubmissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  //res.send("Hello World from route 4!")

  //extracting the user and problem data
  const {userId, problemId, solution} = req.body;

  //randomly accept the solution
  const isAccepted = Math.random() < 0.5;

  //Create a new Submission object
  const submission = {
    userId,
    problemId,
    solution,
    isAccepted
  }

  SUBMISSIONS.push(submission);

  res.send({
    message: "Submission submitted",
    submission: submission
  })

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})