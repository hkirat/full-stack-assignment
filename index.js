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

// Setup HTTP POST route at the '/login' endpoint with a callback function
// that handles the request and sends a response
app.post('/login', function(req, res) {

// This code uses destructuring assignment to extract the email
//  and password properties from the req.body object, which contains the data sent in the request body.
  const { email, password } = req.body;

// Find the user with the given email in USERS array by using find() method
  const user = USERS.find(user => user.email === email);

// If user is not found, return a 401 status code with an error message
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password'});
  }

// check if the password matches the user's passwors
  if (user.password !== password) {
    return res.status(401).json({error: 'Invalid email or password' });
  }

// This code generates a random number between 0 and 999999
//  and assigns it to the token variable
  const token = Math.floor(Math.random()* 1000000);

// This code returns a 200 status code with JSON response containing the 'token'
// variable. the cient can then use the token to authenticate request.
  return res.status(200).send('Hello World from route 3!');
  
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