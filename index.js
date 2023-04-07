const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3001

app.use(bodyParser.json())
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
  {
    problem: "Two states",
    solution: "function max(arr) { return Math.max(...arr) }",
    isAccepted: true
  }
]

app.post('/signup', function (req, res) {

  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  //Store email and password (as is for now) in the USERS array above 
  // (only if the user with the given email doesnt exist)
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    res.status(400).json({ error: 'User already exists' });
  } else {
    // Add new user to USERS array
    USERS.push({ email, password });
    // return back 200 status code to the client
    res.status(200).json({ message: 'User registered successfully' });
  }
  // console.log(USERS);
  res.send('Hello World!')
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)

    if (existingUser.password === password) {
      const token = "randomstring"
      res.status(200).json({ message: 'User logged in successfully', token });
    } else {
      // If the password is not the same, return back 401 status code to the client
      res.status(401).json({ error: 'Password is incorrect' });
    }
  }
  res.send('Hello World from route 2!')
})

app.get('/questions', function (req, res) {
  //return the user all the questions in the QUESTIONS array  
  res.json(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.json(SUBMISSION)
  res.send("Hello World from route 4!")
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { problem, solution } = req.body;

  // random acceptance/rejection of solution
  const isAccepted = Math.random() < 0.5;

  // Store submission in SUBMISSIONS array
  const submission = { problem, solution, isAccepted };
  SUBMISSION.push(submission);

  res.json(submission);
  res.send("Hello World from route 4!")
});

// leaving as hard todos



// Creating a Middleware that checks if the user is an admin or not

function isAdmin(req, res, next) {
  const user = USERS.find(user => user.email === req.body.email);
  if (!user || !user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    next();
  }
}

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/problems', isAdmin, function (req, res) {
  // Adding the exact logic to decode body
  // body should have title, description, testCases as an object contains in array
  const { title, description, testCases } = req.body;

  // Add the problem to the QUESTIONS array
  const problem = { title, description, testCases };
  QUESTIONS.push(problem);

  res.json(problem);
})


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})