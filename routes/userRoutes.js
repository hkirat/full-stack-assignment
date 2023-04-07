const express = require("express");
const router = express.Router();

//Database
const USERS = [
  { email: "shivam@example.com", password: "password123", role: "admin" },
  { email: "kirat@example.com", password: "mypassword", role: "user" },
];

const QUEST = ["Question 1", "Question 2"];

const SUBMISSIONS = ["Submission 1", "Submission 2"];

//Controllers
const questions = (req, res) => {
  res.send(QUEST);
};
const registerUser = (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);
  if (user) {
    res.status(401);
    res.send("User Already Exists!");
  }
  USERS.push({ email, password, role: "user" });
  res.status(200);
  res.send("User Created Successfully!");
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find((user) => user.email === email);
  if (!user) {
    res.status(401);
    res.send("User Not Found!");
  }
  if (user.password !== password) {
    res.status(401);
    res.send("Invalid Password!");
  }
  res.status(200);
  res.send("Login Successful");
};

const submissions = (req, res) => {
  res.send(SUBMISSIONS);
};

const submit = (req, res) => {
  const { solution } = req.body;
  console.log(solution);
  if (solution.length > 5) {
    SUBMISSIONS.push(solution);
    res.send("Correct Solution!");
  } else {
    res.send("Wrong Solution!");
  }
};
const newProblem = (req, res) => {
  const { email, question } = req.body;
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    res.send("User not found!");
  } else {
    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(401).send("Unauthorized");
    }

    QUEST.push(question);
    res.status(201).send("Question added successfully");
  }
};

//Routes
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/questions").get(questions);

router.route("/submissions").get(submissions).post(submit);

router.route("/problems").post(newProblem);

module.exports = router;
