const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json()) // For parsing json data
app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded data
app.use(express.static('public')) // For serving static files from public directory

const USERS = [{
    username: "joelinder",
    email: "joelinder@email.com",
    password: "12345"
},
{
  username: "joe",
  email: "joe@email.com",
  password: "1234"
},
{
  username: "james",
  email: "james6@email.com",
  password: "johndoe@100"
}];

const QUESTIONS = [{
    title: "Max of an array",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
    title: "Min of an array",
    description: "Given an array , return the minimum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "1"
    }]
},
{
    title: "Sum of an array",
    description: "Given an array , return the sum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "15"
      }]
}];


const SUBMISSION = [

]

let username = null;

// Function to find the username based on email and password
const findUsernameByEmailAndPassword = (email, password) => {
  const user = USERS.find((user) => user.email === email && user.password === password);
  return user ? user.username : null;
}


app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log(USERS);
})

app.get('/signup(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/signup.html'));
})

app.post('/signup', function(req, res) {
  const {username, email, password} = req.body;
  console.log(`Email is : `, email, `, password is : `, password);
  
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const existingUser = USERS.find(user => user.username === username || user.email === email);

  if (existingUser) {
    return res.status(409).send('User already exists with the given username or email');
  }

  // return back 200 status code to the client

  USERS.push({username, email, password});
  console.log(USERS);
  return res.status(200).send('User created successfully!');
})

app.get('/login(.html)?', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', '/login.html'));
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const {email, password} = req.body;
   username = findUsernameByEmailAndPassword(email, password);

  // Check if the user with the given email exists in the USERS array
  const existingUser = USERS.find((user) => user.email === email && user.password === password);
  // Also ensure that the password is the same  
  // If the password is the same, return back 200 status code to the client

  if(existingUser) {
    // res.status(200).send(`Welcome back! ${username}`);
    res.redirect('/questions');
  }
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  return res.status(401).send('Invalid email or password entered');
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  // res.send(`Welcome back! ${username}`);
  res.send(QUESTIONS);
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