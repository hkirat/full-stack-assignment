const express = require("express");
const app = express();
app.use(express.json());
const port = 3001;

const QUESTIONS = [
  {
    title: "Reverse String",
    description:
      "Write a function that takes a string input and returns the string reversed.",
    testCases: [
      {
        input: "hello",
        output: "olleh",
      },
      {
        input: "world",
        output: "dlrow",
      },
      {
        input: "abcdefg",
        output: "gfedcba",
      },
    ],
  },
];

const SUBMISSION = [];

const USERS = [];

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  // Checking if email already exists in users array
  const userExists = USERS.find((user) => user.email === email);

  if (userExists) {
    // Returning an error response if user already exists
    return res.status(400).send("User with the given email already exists");
  }

  // Adding email and password to USERS array
  USERS.push({ email, password });

  // Returning a success response
  res.status(200).send("User registered successfully");
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  // Searching for user by email in USERS array
  const user = USERS.find((user) => user.email === email);

  if (!user || user.password !== password) {
    // Returning an error response if user does not exist or password is incorrect
    return res.status(401).send("Invalid email or password");
  }

  // Generating a random token
  const token = Math.random().toString(36).substring(2);

  // Updating user's token in users array
  user.token = token;

  res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  //returning the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  const problemId = parseInt(req.query.Id); // Extracting problemId from query parameter

  if (problemId) {
    // If problemId is provided, find the submission with matching Id
    const submission = SUBMISSION.find((sub) => sub.Id === problemId);
    console.log(SUBMISSION);

    if (submission) {
      // If submission is found, return it
      res.json(submission);
    } else {
      // If submission is not found, returning error message
      res.status(404).json({ error: "Submission not found" });
    }
  } else {
    // If problemId is not provided, return all submissions
    res.json(SUBMISSION);
  }
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const submission = req.body.submission;
  const isAccepted = Math.random() < 0.5;
  if (isAccepted) {
    SUBMISSION.push({ ...submission });
    res.status(201).send("Submission Accepted");
  } else {
    res.status(400).send("Submission Rejected");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
