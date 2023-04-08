const express = require('express'); // for creating the server
const app = express(); // create the server
const port = 3000; // the port the server will listen on
const bodyParser = require('body-parser');// for parsing the body of the request
const jwt = require('jsonwebtoken');// to create a json web token
const e = require('express');

// MIDDLEWARE
const urlencodedParser = bodyParser.urlencoded({ extended: true });// Add logic to decode body

//  VARIABLES
let USERS = [["test123@gmail.com","123456"]]; // store the users in this array
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}]; // store the questions in this array
const SUBMISSION = []; // store the submissions in this array


// ROUTES
// Signup route:-
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
}) // serve the index.html file when the user visits the root route

  


app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/views/signup.html');
}) // serve the signup.html file when the user visits the /signup route

app.post('/signup',urlencodedParser, function(req, res) {
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;
  const user_length = USERS.length;
  let flag = true;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  /*Here email is compared  and if email already exist then flag value bwcome false that prevent updation*/
  for (var i = 0; i < user_length; i++) {
    if (USERS[i][0] === email) {
      res.status(200).send("Account already exists, please login")
      res.json({"USER": USERS});
      flag = false;
    break;
    }
  }
  if (flag){
    USERS.push([email, password]);
    res.status(200).send(`<h1>Account created successfully</h1>
  <button type="button" onclick="window.location.href='http://localhost:${port}/login'" method="get">Go to Login Page</button>`);
  }
  
  // return back 200 status code to the client
  
})
// Login route:-
app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/views/login.html');
})
app.post('/login',urlencodedParser, function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email_login = req.body.email;
  const password_login = req.body.password;
  const user_length_login = USERS.length;
  let flag_login_email = false;
  let flag_login_password = false;
   // Check if the user with the given email exists in the USERS array
  for (var i = 0; i < user_length_login; i++) {
    if (USERS[i][0] === email_login) {
      flag_login_email = true;
      }
  }
  // Also ensure that the password is the same
  if (flag_login_email){
    for (var i = 0; i < user_length_login; i++) {
      if (USERS[i][1] === password_login) {
        flag_login_password = true;
        }
    }
    if (flag_login_password){
      res.status(200).send(`<h1>Login successful</h1>
      <button type="button" onclick="window.location.href='http://localhost:${port}/'" method="get">Go to Home</button>`);// If the password is the same, return back 200 status code to the client
    }
    else{
      res.status(401).send(`<h1>Incorrect password</h1>
      <button type="button" onclick="window.location.href='http://localhost:${port}/login'" method="get">Try again</button>`);// If the password is not the same, return back 401 status code to the client
  }
  }else{
    res.status(401).send(`<h1>Account doesn't exist ,please signup</h1>
    <button type="button" onclick="window.location.href='http://localhost:${port}/signup'" method="get">Go to Signup Page</button>`) // If the password is not the same, return back 401 status code to the client
  }
// Also send back a token (any random string will do for now)  
// Create a token
const token = jwt.sign({ userId: email_login }, 'your_secret_key');
res.json({ "Token": token });

})


// Questions route:-
app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})