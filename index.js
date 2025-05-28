const express = require('express')
const bcrypt = require('bcrypt');
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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    // Check if the user with the given email already exists in the USERS array
    const user=USERS.findOne(user => user.email === email);
    if (user) {
      return res.status(400).send('User already exists');
    }
    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const newUser = {
    email: email,
    password: hashedPassword
    };
    USERS.push(newUser);
    // return back 200 status code to the client
    res.status(200).send('User created successfully');
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    // Check if the user with the given email exists in the USERS array
    const user = USERS.find(user => user.email === email);
    if (!user) {
      return res.status(401).send('User not found');
    }
    // Also ensure that the password is the same
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    // If the password is not the same, return back 401 status code to the client
    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }
    // return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = Math.random().toString(36).substring(2); // Generate a random token
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
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