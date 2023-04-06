const express = require("express");
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json);

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

const SUBMISSIONS = [];

function checkAdmin(req, res, next) {
  const { isAdmin } = req.query;
  if (isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find((user) => user.email === email);

  if (userExists) {
    return res.status(400).send("User with this email already exists");
  }

  // Add new user to USERS array
  USERS.push({ email, password });

  // return back 200 status code to the client
  res.status(200).send("User created successfully");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(
    (user) => user.email === email && user.password === password
  );

  // If the password is not the same, return back 401 status code to the client
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  res.status(200).json({ message: "Login successful", token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(QUESTIONS);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem
  const { problem, solution } = req.body;

  // Randomly accept or reject a solution
  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSIONS array
  const submission = (problem, solution, isAccepted);
  SUBMISSIONS.push(submission);

  // Sending back a HTTP response to the client
  const status = isAccepted ? 200 : 400;
  const message = isAccepted ? "Solution accepted!" : "Solution rejected";
  res.status(status).json({ message, submission });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/add-problems", checkAdmin, function (req, res) {
  // Logic to decode body
  const { title, description, testCases } = req.body;

  // Store the problem in QUESTIONS array
  const problem = { title, description, testCases };
  QUESTIONS.push(problem);

  // Send back a HTTP response to the client
  res.status(200).json({ message: "Problem added", problem });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
