const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
},
{
  title: "Sum of Elements",
  description: "Given an array of integers, return the sum of all elements in the array.",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "15"
  }]
},
{
  title: "Reverse String",
  description: "Given a string, return the string in reverse order.",
  testCases: [{
    input: "\"hello\"",
    output: "\"olleh\""
  }]
},
{
  title: "Palindrome Check",
  description: "Given a string, check if it is a palindrome. Return true if it is, otherwise false.",
  testCases: [{
    input: "\"racecar\"",
    output: "true"
  }]
},
{
  title: "Factorial Calculation",
  description: "Given a non-negative integer, return the factorial of the number.",
  testCases: [{
    input: "5",
    output: "120"
  }]
},
{
  title: "Find Duplicates",
  description: "Given an array of integers, return a list of duplicates in the array.",
  testCases: [{
    input: "[1,2,3,4,5,5,6,6]",
    output: "[5,6]"
  }]
}];



const SUBMISSIONS = [

]

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  USERS.push(user);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  res.status(200).send('Signup successful');
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  let loginUserEmail = req.body.email
  let loginUserPassword = req.body.password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const existingUser = USERS.find(user => user.loginUserEmail === loginUserEmail && user.password === loginUserPassword);
  if (existingUser) {
    let token = randonStringGenerator();
    return res.status(200).send(`Welcome Here's your token ${token}`);
  }
  else {
    return res.status(401).send('Could not find your email or password');
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

function randonStringGenerator() {
  let token = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < 15; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return token;
}

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSIONS)
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution

  const submissionTitle = req.body.title;
  const submissionAns = req.body.answer
  let validSubmisson = QUESTIONS.find(question => question.title === submissionTitle && question.testCases[0].output === submissionAns)
  if (validSubmisson) {
    let submission = {
      title: submissionTitle,
      answer: submissionAns
    }
    // Store the submission in the SUBMISSION array above
    SUBMISSIONS.push(submission);
    res.status(200).send("Submission is correct and accepted")
  } else {

  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  if (req.body.userDesignation === "ADMIN") {
    const newQuestion = {
      title: req.body.title,
      description: req.body.description,
      testCases: req.body.testCases
      //should be an js array
      //  [{
      //   input: "[1,2,3,4,5,5,6,6]",
      //   output: "[5,6]"
      // }]
    }
    QUESTIONS.push(newQuestion);
    res.status(200).send(`Updated Questions array ${QUESTIONS}`)
  } else {
    res.send("Restricted Access")
  }
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})