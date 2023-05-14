const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

// Middlewares
app.use(bodyParser.json());

const USERS = [
  { username: "xyz5", password: "12345" },
  { username: "xyz2", password: "12342" },
  { username: "xyz3", password: "12343" },
];

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
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  const usernames = USERS.map((userData) => userData.username);
  if (!usernames.includes(req.body.username)) {
    USERS.push(req.body);
    res.send(`Successfully created account for user ${req.body.username}`);
  } else {
    res.send(`User ${req.body.username} already exists!!!`);
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  let userExists = false;
  let userData;

  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].username === req.body.username) {
      userExists = true;
      userData = USERS[i];
    }
  }

  if (userExists && userData.password === req.body.password) {
    res.send("Congrats, you are logged in!!!");
  } else {
    res.send("Check username or password!!!");
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(JSON.stringify(QUESTIONS));
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
  console.log(`Example app listening on port ${port}`);
});
