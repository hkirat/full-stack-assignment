const express = require("express");
const { genRandomString } = require("./utils");

const app = express();

const USERS = [
  { email: "walt@gmail.com", password: "disnei", admin: true },
  { email: "ana@gmail.com", password: "marie" },
];

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

app.use(express.json());

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Signup needs valid email and password" });
  }

  const user = USERS.find((user) => user.email === email);
  if (user) {
    return res.status(409).json({ error: "Email already registred" });
  }

  // return back 200 status code to the client
  USERS.push({ email, password });
  return res.status(200).json({ message: `Signed up to email: ${email}` });
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // If the password is not the same, return back 401 status code to the client
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = genRandomString();
  return res.status(200).json({ message: "Logged in", token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json({ submissions: SUBMISSION });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  if (Math.random() > 0.5) {
    return res.status(400).json({ error: "problem not accepted" });
  }
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(req.body.submission);
  return res.status(200).json({ message: "submission accepted" });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin", function (req, res) {
  const { email, password, problem } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Must have email and password" });
  }

  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid login" });
  }

  if (!user.admin) {
    return res.status(403).json({ error: "User not an admin" });
  }

  QUESTIONS.push(problem);
  return res.status(200).json({ message: "Problem added" });
});

module.exports = app;
