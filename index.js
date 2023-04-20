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

    const { email, password, userType } = req.body;
    const existingUser = USERS.find((userObject) => userObject.email == email);
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    USERS.push({ email, password, userType });
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

const authenticate = (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({ message: "Auth error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid token" });
  }
};

app.post("/questions", authenticate, (req, res) => {
  const { title, description, testCases } = req.body;
  const userEmail = req.user.inputEmail;
  const existingUser = USERS.find(
    (userObject) => userObject.email == userEmail
  );
  if (existingUser.userType != "admin") {
    return res.status(401).json({ errors: [{ msg: "Insufficient Access" }] });
  }
  const questionId = QUESTIONS.length + 1;

  const newQuestion = { questionId, title, description, testCases };

  QUESTIONS.push(newQuestion);
  res.status(201).json(newQuestion);
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

app.listen(port, () => {
  console.log(`Basic leetcode dummy app listening on port ${port}`);
});
