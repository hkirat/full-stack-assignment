const express = require("express");
const app = express();
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

//Creating Signup
app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  // if (!USERS.email && !USERS.password) {
  //   res.send("Email and password is required");
  // }

  const userExist = USERS.some((user) => user.email == email);

  if (!userExist) {
    USERS.push({ email, password });
    res.status(200).send("User created successfully");
    console.log("Signup Successfull");
  } else {
    res.status(400).send("User with this email already exists");
  }
});

//Creating Login
app.post("/login", function (req, res) {
  const { email, password } = req.body;

  const user = USERS.some(
    (user) => user.email == email && user.password == password
  );

  const token = Math.random().toString(36).substring(2);
  if (user) {
    res.status(200).send({ token });
    console.log("Login Successfull");
  } else {
    res.status(400).send("Invalid email or password");
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
  res.send("Hello from route3");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).send(SUBMISSION);
  res.send("Hello from route4");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { problem, solution } = req.body;
  const submission = { problem, solution, accepted: Math.random() < 0.5 };
  SUBMISSION.push(submission);

  res.send(
    `Submission received! Your solution was ${
      submission.accepted ? "accepted" : "rejected"
    }`
  );
  s;
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
