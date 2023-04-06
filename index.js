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

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (USERS.find((user) => user.email === email)) {
    res.status(400).send("User already exists");
  }
  USERS.push({ email, password });
  // return back 200 status code to the client
  res.status(200);
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const users = USERS.find((user) => user.email === email);
  console.log(users);
  if (!users) {
    res.status(400).send("User does not exist");
  }
  if (
    USERS.find((user) => user.email === email) &&
    USERS.find((user) => user.password === password)
  ) {
    res.status(200).send({ token: Math.random().toString() });
  } else {
    res.status(400).send("Invalid credentials");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { problem, solution } = req.body;

  // Check if the user is logged in
  if (req.session.user) {
    // Check if the user has submitted the problem
    if (SUBMISSION.find((submission) => submission.problem === problem)) {
      // If the user has submitted the problem, let the user reject the solution
      res.status(400).send("You have already submitted this problem");
    } else {
      // If the user does not have submitted the problem, let the user accept the solution
      SUBMISSION.push({ problem, solution });
      res.status(200).send("Submission accepted");
    }
  } else {
    // If the user is not logged in, return back 401 status code to the client
    res.status(401).send("You are not logged in");
  }

  // Store the submission in the SUBMISSION array above

  // return back 200 status code to the client
  res.status(200);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/admin", function (req, res) {
  const { user, problem } = req.body;
  if (user.isAdmin) {
    QUESTIONS.push(problem);
    res.status(200).send(problem);
  }
  res.status(400).send("User is not an administrator");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
