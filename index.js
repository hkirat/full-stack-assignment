const express = require('express')
const app = express()
const port = 3001

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
  description: "Given an array , return the minimum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "1"
  }]
},
{
  title: "Two states",
  description: "Given an array , return the minimum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "1"
  }]
},

];


const SUBMISSION = [

]

app.get('/', function (req, res) {
  res.send('Leetcode')
})

app.post('/signup', function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password

  // Check if the email already exists
  const existingUser = USERS.find(user => user.email === email); /*
    USERS.find(user => user.email === email)

    USERS.find -> function
    (user => user.email === email) ye ek "for i" sarkh chlte ani yat user he "i" cha kam karat ahe.
    check krte "USER" array mde itrate krte 

    mg "user.email === email" hrek users cha email field la sdyach email sobt compare krte
    jr response ala mnj email exsits krte.
    */

  if (existingUser) {
    res.status(400).send('Email already exists');
    return;
  }



  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({
    email,
    password
  })
  res.status(200).send('Signup successful!');
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, pass } = req.body;


  // Check if the user with the given email exists in the USERS array
  const emailExists = USERS.find(
    user =>
      user.email === email
  );

  if (!emailExists) {
    res.status(400).send('Email does not exist');
    return;
  }

  // Also ensure that the password is the same
  const passwordExists = USERS.find(
    user =>
      user.email === email && user.password === pass
  );

  if (!passwordExists) {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).send('Invaild credentials');
    return;
  }

  // If the password is the same, return back 200 status code to the client

  res.status(200).send('Login successful!');


  // Also send back a token (any random string will do for now)
  res.send('token123456');



  res.send('login successful!');
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
  res.send("Hello World from route 3!")
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})