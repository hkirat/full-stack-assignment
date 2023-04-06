const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3001;

require("dotenv").config();

app.use(express.json());

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

app.post("/signup", function (req, res) {
  let { username, email, password, type } = req.body;

  if (!username || !email || !password) {
    res
      .status(400)
      .send(
        '"username", "email" and "password" field is missing for authentication'
      );
    return;
  }

  // Type of user (ADMIN/USER) if nothing is given USER is taken as default
  type = !type ? "USER" : type;

  let newUser = {
    username,
    email,
    password,
    type,
  };

  let queryUser = USERS.find((user) => user.email == newUser.email);

  if (queryUser) {
    res.status(400).send("user already exists");
    return;
  }

  // Mock saving to DB
  USERS.push(newUser);

  // Deleting the password from the search object so that the decoded JWT token won't reveal the password
  newUser = { ...newUser };
  delete newUser.password;

  const jwtToken = jwt.sign(newUser, process.env.JWT_SECRET);
  res.status(200).send(jwtToken);
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .send('"email" and "password" field is missing for authentication');
    return;
  }

  let queryUser = USERS.find((user) => user.email === email);

  console.log(queryUser.password);
  console.log(password);

  if (!queryUser || queryUser.password !== password) {
    res.status(401).send("email or password is incorrect");
    return;
  }

  // Deleting the password from the search object so that the decoded JWT token won't reveal the password

  queryUser = { ...queryUser };
  delete queryUser.password;

  const jwtToken = jwt.sign(queryUser, process.env.JWT_SECRET);
  res.status(200).send(jwtToken);
});

app.get("/questions", function (req, res) {
  res.send(
    QUESTIONS.map((question, index) => ({ problemId: index, ...question }))
  );
});

app.get("/submissions", function (req, res) {
  let { email } = req.body;
  if (!email) {
    res.status(200).send([]);
  }
  let userSubmission = SUBMISSION.filter(
    (submission) => submission.email === email
  );

  res.status(200).send(userSubmission);
});

app.post("/submissions", function (req, res) {
  let { email, solution, problemId } = req.body;

  let submission = {
    email,
    solution,
    problemId,
    accepted: Boolean(Date.now() % 2),
  };

  SUBMISSION.push(submission);

  res.status(202).send(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
