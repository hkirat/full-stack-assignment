const express = require("express");
const app = express();
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const JWT_SECRET = "123456789"

const port = 3001;

const USERS = [];
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
const SUBMISSION = [];

// Middleware to check for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// JSON middelware
app.use(express.json());

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Both email and password are required");
    return;
  }

  if (USERS.find((user) => user.email === email)) {
    res.status(400).send("User with this email already exists");
    return;
  }

  USERS.push({ email, password });
  console.log(USERS);
  res.status(200).send("User created successfully");
});

//login route
app.post("/login", function (req, res) {
  const { email, password } = req.body;

  console.log(JWT_SECRET)

  if (!email || !password) {
    res.status(400).send("Both email and password are required");
    return;
  }

  const user = USERS.find((user) => user.email === email);

  if (!user || user.password !== password) {
    res.status(401).send("Invalid email or password");
    return;
  }

  const token = jwt.sign({ email: user.email }, JWT_SECRET);
  res.status(200).send({ token });
});

app.get("/questions", authenticateToken, function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send("Hello questions!");
});

app.get("/submissions", authenticateToken, function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route auth!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
