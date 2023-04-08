// External dependencies
import express from "express";

// Setup
const app = express();
const port = 3000;

// Middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Helper data
const USERS = [];
const SUBMISSIONS = [];
const TOKENS = {};
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

// Handlers
app.post("/signup", function (req, res) {
  const { email, password, isAdmin = false } = req.body;

  // Validate field values
  if (!email || !password) {
    res.status(400).json({ message: "Bad Request. Missing required fields." });
    return;
  }

  // Check if user already exists
  const user = USERS.find((user) => user.email === email);
  if (user) {
    res.status(409).json({ message: "Conflict. User already exists." });
    return;
  }

  // Add user and send back success status
  USERS.push({ email, password, isAdmin });
  res.status(200).json({ message: "OK. User created successfully." });
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  // Validate field values
  if (!email || !password) {
    res.status(400).json({ message: "Bad Request. Missing required fields." });
    return;
  }

  // Check if user exists
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    res.status(404).json({ message: "Not Found." });
    return;
  }

  // Check if password is correct
  if (user.password !== password) {
    res.status(401).json({ message: "Unauthorised." });
    return;
  }

  // Keep token secured for future reference
  const token = Date.now();
  TOKENS[token] = email;

  // Send back success status, message and token
  res.status(200).json({
    message: "OK. User logged in successfully.",
    token,
  });
});

app.get("/questions", function (req, res) {
  const { token } = req.body;

  // Questions can be fetched only by logged in users
  if (!token) {
    res.status(401).json({ message: "Unauthorised." });
    return;
  }

  res.status(200).json({ message: "OK", questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  const { token } = req.body;

  // Submissions can be fetched on by logged in users
  if (!token) {
    res.status(401).json({ message: "Unauthorised." });
    return;
  }

  res.status(200).json({ message: "OK", submissions: SUBMISSIONS });
});

app.post("/submissions", function (req, res) {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ message: "Bad Request. Missing required fields." });
    return;
  }

  res.status(200);

  // Randomly accepting/rejecting submissions
  if (Math.random() > 0.5) {
    res.json({ message: "Unsuccessful submission." });
    return;
  }

  SUBMISSIONS.push({ attempt: SUBMISSIONS.length + 1, code });
  res.json({ message: "Successful submission." });
});

app.post("/questions", function (req, res) {
  const { token, question } = req.body;

  // Validations
  if (!token) {
    res.status(401).json({ message: "Unauthorised." });
    return;
  }

  if (!question) {
    res.status(400).json({ message: "Bad Request. Missing required fields." });
    return;
  }

  // Find email using login token to find correct user
  const email = TOKENS[token];
  const user = USERS.find((user) => user.email === email);

  if (!user) {
    res.status(404).json({ message: "Not Found." });
    return;
  }

  // Check whether the user is admin or not
  if (!user.isAdmin) {
    res.status(401).json({
      message: "Unauthorised. Only admins are allowed to submit questions.",
    });
    return;
  }

  QUESTIONS.push(question);
  res.status(200).json({ message: "OK. Question submitted successfully." });
});

// Start the server 🔥
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
