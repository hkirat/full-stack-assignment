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

//function to generate randome token
function generateRandomToken() {
  return Math.random().toString(36).substring(2);
}

app.use(express.json());

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Both email and password are required");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.some((user) => user.email === email);
  if (userExists) {
    return res.status(409).send("User already exists");
  }
  USERS.push({ email, password });

  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Both email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  // Also ensure that the password is the same
  if (user && user.password === password) {
    const token = generateRandomToken();
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    res.status(200).json({ token });
  }
  // If the password is not the same, return back 401 status code to the client
  res.sendStatus(401);
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;
  // Store the submission in the SUBMISSION array above
  const submission = {
    solution: req.body.solution,
    isAccepted,
  };
  SUBMISSION.push(submission);

  res.sendStatus(200);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
