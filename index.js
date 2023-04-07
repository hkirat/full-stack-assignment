const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{    title: "Two states",    description: "Given an array , return the maximum of the array?",    testCases: [{        input: "[1,2,3,4,5]",        output: "5"    }]
}];

const SUBMISSION = [];

app.use(express.json());

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    res.status(400).send('User already exists');
  } else {
    USERS.push({ email, password });
    res.sendStatus(200);
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email);
  if (!user) {
    res.status(401).send('Invalid credentials');
  } else if (user.password !== password) {
    res.status(401).send('Invalid credentials');
  } else {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = Math.random().toString(36).substr(2);
    res.status(200).send({ token });
  }
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const { problemId, solution } = req.body;
  const accepted = Math.random() < 0.5;
  const submission = { problemId, solution, accepted };
  SUBMISSION.push(submission);
  res.sendStatus(200);
});

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const ADMIN_TOKEN = Math.random().toString(36).substr(2);

app.post("/problems", function(req, res) {
  const { token, title, description, testCases } = req.body;

  if (token !== ADMIN_TOKEN) {
    res.status(401).send('Unauthorized');
  } else {
    const problem = { title, description, testCases };
    QUESTIONS.push(problem);
    res.sendStatus(200);
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});
