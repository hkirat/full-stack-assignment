const express = require('express')
const bodyParser = require('body-parser'); // Import body-parser
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

app.use(express.static('public'));
// app.use(express.json())
app.use(bodyParser.urlencoded()); // Use body-parser middleware for URL-encoded form data



app.post('/signup', function (req, res) {
  // Now you can access req.body and its properties
  const { email, password } = req.body;

  // Add logic to decode body
  // body should have email and password

  // Check if user with the given email already exists in the USERS array
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    // If user with the given email already exists, return an error response
    return res.status(400).send('Email already exists');
  } else {

    // Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const newUser = { email, password };
    USERS.push(newUser);
    console.log(USERS)
  }

  // Return a success response
  res.status(200).send('User created successfully');
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const { email, password } = req.body;
  const authenticate = USERS.find((user) => {
    return user.email == email && user.password == password
  })

  if (authenticate) {
    res.status(200).send(`Welcome to the club ${email}`)
  } else {
    res.status(400).send('Authentication failed')
  }

  // res.send('Hello World from route 2!')
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  // res.send("Hello World from route 3!")
  res.send(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  // just pass through query, because i am being lazy to write a form submission
  const { email } = req.query;
  console.log(`email from submission route ${email}`)
  submission = []
  SUBMISSION.forEach((topic) => {
    if (topic.email == email) {
      submission.push(topic.solution)
    }
  })
  res.status(400).send(submission)
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { email, password, solution } = req.body;
  const authenticate = USERS.find((user) => {
    return user.email == email && user.password == password
  })
  if (authenticate) {
    const accept = Math.random() > 0.5;
    if (accept) {
      const sol = { email, solution }
      SUBMISSION.push(sol)
      res.status(400).send('Successfully submitted 🎉')
    } else {
      res.status(400).send('Sorry submission failed try again :)')
    }
  } else {
    res.status(200).send('No user found')
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})