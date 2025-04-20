const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(express.json());


const USERS = [];
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5"
      }
    ]
  }
];
const SUBMISSION = [];

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  USERS.push({ email, password });
  res.status(200).send('User registered successfully');
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  const user = USERS.find(user => user.email === email);

  if (!user) {
    return res.status(401).send('User not found');
  }

  if (user.password !== password) {
    return res.status(401).send('Incorrect password');
  }

  // Generate token (here using a dummy string)
  const token = Math.random().toString(36).substring(2);
  res.status(200).json({ message: 'Login successful', token });
});

app.get('/questions', function(req, res) {
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
  // Ideally, we'd filter submissions per user
  res.status(200).json(SUBMISSION);
});

app.post("/submissions", function(req, res) {
  const { questionTitle, solution, email } = req.body;

  if (!questionTitle || !solution || !email) {
    return res.status(400).send("Missing required fields");
  }

  // Randomly accept or reject
  const isAccepted = Math.random() < 0.5;

  SUBMISSION.push({
    email,
    questionTitle,
    solution,
    status: isAccepted ? "Accepted" : "Rejected"
  });

  res.status(200).json({ status: isAccepted ? "Accepted" : "Rejected" });
});

// 🚧 Admin-only route placeholder
const isAdmin = (req) => {
  // Very basic admin check for demo purposes
  return req.body.email === "admin@example.com";
};

app.post('/add-question', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).send("Only admins can add questions");
  }

  const { title, description, testCases } = req.body;
  if (!title || !description || !Array.isArray(testCases)) {
    return res.status(400).send("Invalid question format");
  }

  QUESTIONS.push({ title, description, testCases });
  res.status(200).send("Question added successfully");
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
