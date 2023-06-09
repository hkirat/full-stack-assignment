const express = require('express')
const app = express()
const port = 3001
const validator = require('validator');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:'true'}))

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},

{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
  }]
}

];

//This is a new line that i have added


const SUBMISSION = []

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email
  const password = req.body.password;

  let object = {
    email,
    password
  }
  if(validator.isEmail(email))
    USERS.push(object);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  res.send('Sign up successful')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const loginEmail = req.body.email;
  const loginPassword = req.body.password;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let flag = false;
  USERS.forEach((user,index) =>{
    if(user.email === loginEmail){
      if(user.password === loginPassword)
        flag = true;
    }

  } )

  if(flag)
  res.send('Here is your token good sir/mam');

  else
    res.status(401).send("Invalid user");

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  
})

app.get('/questions', function(req, res) {

let response = '';

QUESTIONS.forEach((question) =>{
  response +=   `
  ${question.title}<br>
  ${question.description}<br>
  ${JSON.stringify(question.testCases)}<br><br>
  `
})
  res.send(response);
  
  //return the user all the questions in the QUESTIONS array

})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   SUBMISSION.forEach((submission, index)  => {
     if(req.body.questionid === submission.questionid){
       res.send(submission.answer);
     } 
   } 
   
   )
   res.status(401).send("You have not submitted this question")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const {questionid, answer, userId} = req.body;
   SUBMISSION.push({
    questionid,
    answer,
    userId,
   })
   // Store the submission in the SUBMISSION array above
  res.send("Submission successful!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(3000, function() {
  console.log(`Example app listening on port 3000`)
})