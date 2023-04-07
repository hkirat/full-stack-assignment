const express = require('express')
const app = express()
const port = 3000

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSIONS = [];

app.use(express.json());

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if user with the given email exists in the USERS array
  const user = USERS.find(u => u.email === email);
  if (user) {
    return res.status(409).send('User already exists');
  }

  // Add user to the USERS array
  USERS.push({ email, password });

  // return 200 status code to the client
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if user with the given email exists in the USERS array and the password is correct
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // Return 200 status code with a random token
  const token = Math.random().toString(36).substring(2);
  res.status(200).json({ token });
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
  res.json(SUBMISSIONS);
});

app.post("/submissions", function(req, res) {
  const submission = req.body;

  // Randomly accept or reject the submission
  const accepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push({ ...submission, accepted });

  // Return 200 status code to the client
  res.sendStatus(200);
});

// Create a route that lets an admin add a new problem
// Ensure that only admins can do that.
app.post("/problems", function(req, res) {
  const { title, description, testCases } = req.body;

  // Check if the user is an admin (you can implement this with any authentication method you prefer)
  const isAdmin = true; // Placeholder for admin check

  if (!isAdmin) {
    return res.sendStatus(403);
  }

  // Add the new problem to the QUESTIONS array
  QUESTIONS.push({ title, description, testCases });

  // Return 200 status code to the client
  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
