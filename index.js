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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {Email, Password} = req.body
  if(!Email || !Password) res.statusCode(401).send('Email and Password are required')

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const user = USERS.find((user) => user.email === Email);

  if(!user){
    let newUser = {Email, Password}
    USERS.push(newUser)
    res.statusCode(200).send('User is added succesfully')
  }
  // return back 200 status code to the client

  res.statusCode(401).send("User already exists")
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { Email, Password } = req.body;
  if (!Email || !Password) res.statusCode(401).send("Email and Password are required");

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const user = USERS.find((user) => user.email === Email);
  if(!user) {
    return res.status(404).send("User does not exist");
  }

  if(user.password !== Password) {
    return res.status(401).send("Password is incorrect");
  }


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  res.statusCode(200).send('Authorisation Succesfull!');
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.statusCode(200).send(QUESTIONS);
});

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.statusCode(200).send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  let newSubmission = {solution, isAccepted}

  SUBMISSION.push(newSubmission)
  res.statusCode(200).send(isAccepted)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
