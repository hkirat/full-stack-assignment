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
}];


const SUBMISSION = [

]
// ''' this line request to the user end point. When a Post request is 
// made to the endpoint , the callback funtion passed as second argument will be executed'''
app.post('/signup', function(req, res) {

// ths line destructing assignments to extract the 'email' and 'password' from the rew.body
// req.body is object which repersent the data sent in the request body

  const {email, password } = req.body;

// check if user with given email already exists and the 'some()'method returns 'true'
// if at least one element satisfies the condition, or false otherwise.
  const userExists = USERS.some(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'User with email already exists'});
  }
// if user doesn't exist,create a new user object with email and password
  const newUser = {email, password};

// Add new user object to the USER array
  USERS.push(newUser);

// Return a success response with a 200 status code which indicating that user was created successfully
  return res.status(200).json({message; 'User created successfully'});

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