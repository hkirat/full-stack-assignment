const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser')
const path = require('path');
app.use(express.static(__dirname));
// Add middleware to the express app:

const urlEncoded = bodyParser.urlencoded({extended:true});

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []

app.get('/', function(req, res){
  // Use path module to get the correct path to the index.html file
  const filePath = path.join(__dirname, 'index.html');
  // Return the index.html file
  res.sendFile(filePath);
});

app.get('/signup', function(req, res){
  // Use path module to get the correct path to the signup.html file
  const filePath = path.join(__dirname, 'signup.html');
  // Return the signup.html file
  res.sendFile(filePath);
});

app.post('/signup', urlEncoded, function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;
  const userExists = function(email) { 
    for (let i = 0; i < USERS.length; i++)
    {
      if (USERS[i].email === email) {
        return true;
      }
    }
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (userExists(email)) {
    res.status(400).send("User already exists!");
  }
  else {
     USERS.push({email, password});
  }

  // return back 200 status code to the client
  res.status(200).send("User created successfully!");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Hello World from route 2!')
})

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
