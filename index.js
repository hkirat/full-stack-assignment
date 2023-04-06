const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{    title: "Two states",    description: "Given an array , return the maximum of the array?",    testCases: [{        input: "[1,2,3,4,5]",        output: "5"    }]
}];

const SUBMISSIONS = [];

function isAdmin(req, res, next) {
  // Add logic to check if user is an admin
  // You can use any authentication mechanism to verify if the user is an admin, such as JWT token, session, or database check

  const user = req.user; // Assuming the user object is available in the request object after authentication
  if (!user || !user.isAdmin) {
    return res.status(401).send("Unauthorized");
  }

  // If user is an admin, call the next middleware in the chain
  next();
}

app.use(express.json());

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    return res.status(409).send('User with this email already exists');
  }

  // If the user does not exist, add them to the USERS array
  USERS.push({ email, password });

  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Find the user with the given email in the USERS array
  const user = USERS.find(user => user.email === email);

  if (!user || user.password !== password) {
    // If the user does not exist or password is incorrect, return back 401 status code to the client
    return res.sendStatus(401);
  }

  // If the user exists and password is correct, generate a token (any random string will do for now)
  const token = Math.random().toString(36).substr(2);

  // Send back the token and 200 status code to the client
  res.status(200).json({ token });
});

app.get('/questions', function(req, res) {
  // return all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
  // return all the submissions in the SUBMISSIONS array
  res.json(SUBMISSIONS);
});

app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const submission = req.body;

  // Randomly accept or reject the submission (just for testing purposes)
  const accepted = Math.random() < 0.5;

  // Add the submission and its status to the SUBMISSIONS array
  SUBMISSIONS.push({ ...submission, accepted });

  // Return the submission status and 200 status code to the client
  res.status(200).json({ accepted });
});

app.post("/problems", isAdmin, function(req, res) {
  // Add a new problem to the QUESTIONS array
  QUESTIONS.push(req.body);

  // Return 200 status code to the client
  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});
