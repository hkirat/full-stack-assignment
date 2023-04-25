const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

const USERS = [];

const ADMIN_EMAILS = ['admin@example.com'];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSIONS = [

]

app.post('/signup', (req, res) => {
  // Add logic to decode body
  // body should have email and password

  if (!req.body.username || !req.body.password) {
    // Return a 400 Bad Request error if fields are missing
    return res.status(400).send('Username and password are required');
  }


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({
    username: req.body.username,
    password: req.body.password
  });

  // return back 200 status code to the client
  return res.sendStatus(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  if (!req.body.username || !req.body.password) {
    // Return a 400 Bad Request error if fields are missing
    return res.status(400).send('Username and password are required');
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const email = req.body.username;
  const password = req.body.password;
  const user = USERS.find(user => user.username === email);


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  // Check if user exists and password is correct
  if (user && user.password === password) {
    // Generate and sign a token
    const token = jwt.sign({ email }, 'secret');

    // Return token and 200 status code
    return res.status(200).json({ token });
  } else {
    // Return 401 status code
    return res.status(401).send('Invalid email or password');
  }

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSIONS)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const submission = req.body;

   // Generate random boolean value to determine acceptance
   const isAccepted = Math.random() < 0.5;
 
   // Add submission to array
   SUBMISSIONS.push({ ...submission, isAccepted });
 
   // Return acceptance status
   if (isAccepted) {
     return res.status(200).send('Submission accepted');
   } else {
     return res.status(401).send('Submission rejected');
   }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// Middleware function to check if user is admin
function checkAdmin(req, res, next) {
  const userEmail = req.body.username;

  if (ADMIN_EMAILS.includes(userEmail)) {
    next();
  } else {
    return res.status(401).send('Admin access only');
  }
}

app.post('/questions', checkAdmin, (req, res) => {
  const question = req.body;

  // Add problem to array
  QUESTIONS.push(question);

  // Return success message
  return res.status(200).send('Problem added');
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})