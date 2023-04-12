const express = require("express");
const app = express();
const port = 3001;
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
  // Add logic to decode body
  // body should have email and password

  if (!USERS.find((user) => user.email === req.body.email)) {
    USERS.push({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(USERS);
    return res.status(200).json("user registerd");
  } else {
    return res.status(401).json("user already exists");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const User = USERS.find((user) => user.email === req.body.email);
  // Check if the user with the given email exists in the USERS array
  !User && res.status(401).json("invalid user");
  // body should have email and password

  if (User) {
    if (req.body.password === User.password) {
      // If the password is the same, return back 200 status code to the client
      // Also ensure that the password is the same
      // Also send back a token (any random string will do for now)
      res.status(200).json("login sucessful");
    } else {
      // If the password is not the same, return back 401 status code to the client
      res.status(400).json("incorrect password");
    }
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  const { problem } = req.query;

  const submissionsForProblem = SUBMISSION.filter(
    (submission) => submission.problem === problem
  );

  // Return the users submissions for this problem
  res.send(submissionsForProblem);
});

app.post("/submissions", function (req, res) {
  const { problemId, userId, solution } = req.body;

  if (!problemId || !userId || !solution) {
    res.status(400).send("Missing required fields in request body");
    return;
  }

  const newSubmission = { problemId, userId, solution };
  SUBMISSION.push(newSubmission);

  // Let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.status(201).send({
    message: "Submission successful",
    submissionId: newSubmission.id,
  });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
