const express = require("express");
const app = express();
const port = 3000;
const bodyparser = require("body-parser");
const signRoute = require("./signup.js");

app.use(bodyparser.urlencoded({ extended: false }));

const users = [];

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

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/signup", signRoute);
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    res.status(409).send("user already exist");
  }
  users.push({ username, password });
  res
    .status(200)
    .send(`Sign Up with the UserName: ${username}, Password: ${password}`);
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the users array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
});

//to get all the users that have sign up for the platform
app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/login", (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
