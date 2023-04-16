const express = require('express')
const app = express()
const port = 3000

const users = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  title: "Palindrome",
  description: "Write a function that takes a string and returns true if the string is a palindrome (reads the same backwards as forwards).",
  testCases: [{
    input: "'hello'",
    output: "false"
  }, {
    input: "'level'",
    output: "true"
  }]
}];

const SUBMISSION = [];

app.use(express.json()); // Parse JSON request body

app.post('/signup', (req, res) => {

  const { username, password } = req.body;

  // Check if the username is already taken
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).send('Username already taken');
  }

  // If not, create a new user with the given username and password
  const newUser = {
    username,
    password
  };

  users.push(newUser);
  console.log('New user signed up:', newUser);
  // return res.status(200).send('Signed up');
  return res.status(200).send({ username: newUser.username, message: 'Signed up' });

})

  // Add logic to decode body
  // body should have email and password
  // Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  // res.send('Hello World!')

app.post('/login', function(req, res) {

  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);


  if (user) {
    return res.status(200).send({ username: username, password: password, message: 'Logged in' });
  }

  if (!users.find(user => user.username === username)) {
    return res.status(400).send('Username doesn\'t exist'); 
  }

  if (users.find(user => user.username === username && user.password !== password)) {
    return res.status(400).send('Password doesn\'t match'); 
  }

  res.send('Hello World from login route!')
})
  
  
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);

})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.send(SUBMISSION);
  });


app.post("/submit", function(req, res) {

  const isAccepted = Math.random() >= 0.5;

  // Store the submission in the SUBMISSIONS array
  const submission = {
    title: req.body.title,
    code: req.body.code,
    isAccepted: isAccepted
  };
  
  SUBMISSION.push(submission);

  // Send a response to the client
  if (isAccepted) {
    res.send("Your submission was accepted!");
  } else {
    res.send("Your submission was rejected.");
  }});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})