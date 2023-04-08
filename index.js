const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const tokenMap = new Map();

const port = 3001;

const USERS = [];

app.use(bodyParser.json());

function generateToken(userId) {
  // Generate a random string for the token
  const token = Math.random().toString(36).substr(2);
  // Store the token in a database or cache along with the user ID
  // For simplicity, just store it in a map
  tokenMap.set(token, userId);
  return token;
}

const QUESTIONS = [
  {
    title: "Find minimum element ",
    description: "Given an array , return the minimum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "1",
      },
    ],
    title: "Find maximum element",
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
  // // body should have email and password

  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  USERS.push({ email, password });

  // return back 200 status code to the client

  res.status(200).send("User successfully added");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === req.body.email);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  // Also ensure that the password is the same
  if (user.password !== req.body.password) {
    return res.status(401).send("Invalid email or password");
  }

  const token = generateToken(user.id);
  return res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
  // res.send("Hello World from route 3!")
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  // res.send("Hello World from route 4!")
  const { userId, problemId } = req.query;

  // Filter the submissions array based on the userId and problemId
  const submissions = SUBMISSION.filter((submission) => {
    return submission.userId == userId && submission.problemId == problemId;
  });

  // Send the submissions array in the response
  res.status(200).json(submissions);
});

app.post("/submissions", function (req, res) {
  console.log(SUBMISSION);
  // let the user submit a problem, randomly accept or reject the solution
  const { userId, problemId, code } = req.body;

  // Generate a random result (either "Accepted" or "Rejected")
  const result = Math.random() < 0.5 ? "Accepted" : "Rejected";

  // Store the submission in the SUBMISSION array above
  const submission = { userId, problemId, code, result };
  SUBMISSION.push(submission);

  // Send the result in the response
  res.status(200).json({ result });
  // res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
