const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const USERS = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const QUESTIONS = [
  {
    questionId: 1,
    title: "Two States",
    description: "Given an array, return max of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [];

app.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password").isLength({ min: 5 }).withMessage("Password too short"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const existingUser = USERS.find((userObject) => userObject.email == email);
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    USERS.push({ email, password });
    res.status(200).json({ message: "User Created Successfully" });
  }
);

app.post("/login", (req, res) => {
  const { inputEmail, inputPassword } = req.body;
  const existingUser = USERS.find(
    (userObject) =>
      userObject.email == inputEmail && userObject.password == inputPassword
  );
  if (!existingUser) {
    return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
  }
  if (inputPassword != existingUser.password) {
    return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
  }

  // Generate a JWT
  const token = jwt.sign({ inputEmail }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Send the JWT to the client
  res.status(200).json({ token, message: "Login Successful" });
});

app.get("/questions", (req, res) => {
  res.json(QUESTIONS);
});

app.get("/submissions", (req, res) => {
  const userEmail = req.query.email;

  const userSubmissions = SUBMISSION.filter(
    (submission) => submission.userEmail == userEmail
  );
  // return the users' submmissions for this problem
  res.json(userSubmissions);
});

app.post("/submissions", (req, res) => {
  const { userEmail, questionId, solution } = req.body;
  const isAccepted = Math.random() < 0.5;
  const newSubmission = { userEmail, questionId, solution, isAccepted };
  SUBMISSION.push(newSubmission);
  res.status(201).json(newSubmission);
});

// leaving as hard todos
// create a route that lets an admin to add a new problem
// ensure only admins can do it.

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})