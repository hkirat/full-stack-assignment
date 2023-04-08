// External dependencies
import express from "express";

// Setup
const app = express();
const port = 3000;

// Middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Helper data
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

// Handlers
app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  // Validate field values
  if (!email || !password) {
    res.status(400).json({ message: "Bad Request. Missing required fields." });
    return;
  }

  // Check if user already exists
  const user = USERS.find((user) => user.email === email);
  if (user) {
    res.status(409).json({ message: "Conflict. User already exists." });
    return;
  }

  // Add user and send back success status
  USERS.push({ email, password });
  res.status(200).json({ message: "OK. User created successfully." });
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.send("Hello World from route 2!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
