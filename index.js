const express = require("express");
const app = express();
const port = 3001;
const jwt = require("jsonwebtoken");

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{ input: "[1,2,3,4,5]", output: "5" }],
  },
];

const SUBMISSION = [];

// Signup endpoint
app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  // Check if the user already exists
  const user = USERS.find((u) => u.email === email);
  if (user) {
    return res.status(400).send("User already exists");
  }

  // Create a new user
  const newUser = { email, password };
  USERS.push(newUser);

  // Return token
  const token = jwt.sign({ email }, "secret");
  res.status(200).send({ token });
});

// Login endpoint
app.post("/login", function (req, res) {
  const { email, password } = req.body;

  // Check if the user exists
  const user = USERS.find((u) => u.email === email);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // Check if the password is correct
  if (user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  // Return token
  const token = jwt.sign({ email }, "secret");
  res.status(200).send({ token });
});

app.get("/questions", function (req, res) {
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { problemIndex, code } = req.body;

  // Check if the user is authenticated
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  try {
    const { email } = jwt.verify(token, "secret");
    // Store submission
    SUBMISSION.push({ email, problemIndex, code });
    // Randomly accept or reject
    const accepted = Math.random() < 0.5;
    if (accepted) {
      res.status(200).send("Accepted");
    } else {
      res.status(200).send("Rejected");
    }
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
});

// Admin endpoint to add new problem
app.post("/problems", function (req, res) {
  const { title, description, testCases } = req.body;

  // Check if the user is authenticated as admin
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  try {
    const { email } = jwt.verify(token, "secret");
    const user = USERS.find((u) => u.email === email);
    if (!user || !user.isAdmin) {
      return res.status(401).send("Unauthorized");
    }
    // Add new problem
    QUESTIONS.push({ title, description, testCases });
    res.status(200).send("Problem added successfully");
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
