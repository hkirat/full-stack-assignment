const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));

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

app.get('/login', (req, res, next) => {
  res.send(`
  <form action='/login' method='POST'>
  <label for='username'>Username</label>
  <input type='text' name='username'>
  <label for='password'>Password</label>
  <input type='password' name='password'>
  <button type='submit'>Login</button>
  </form>`)
})

app.get('/signup', (req, res, next) => {
  res.send(`
  <form action='/signup' method='POST'>
  <label for='username'>Username</label>
  <input type='text' name='username'>
  <label for='password'>Password</label>
  <input type='password' name='password'>
  <button type='submit'>SignUp</button>
  </form>
  `)
})

app.post('/signup', function(req, res) {

  const username = req.body.username;
  const password = req.body.password;
  let newUser = { username: username, password: password }
  USERS.push(newUser);
  res.status(200).json(true);
})

app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const userExists = USERS.find(user => user.username === username);
  if(userExists) {
    if(userExists.password === password) {
      res.send(200).json({token: 'snf434p9f3fn3fm39h4394gn0q'})
    } else {
      res.send(401).json(false);
    }
  }
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  res.json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
  const submission = req.body.submission
  SUBMISSION.push(submission);
});

app.post('/admin', (req, res, next) => {
  newProblem = req.body.newProblem;
  QUESTIONS.push(newProblem)
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})