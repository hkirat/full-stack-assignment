const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;

var users = [];
var questions = [
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const submissions = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  try {
    const email = req.body.email;
    const password = req.body.password;
    let userExists = users.some((obj) => obj.email == email);
    if (!userExists) {
      users.push(req.body);
      res.status(200).send("USER REGISTERED!");
    } else {
      res.status(403).send("USER ALREADY EXISTS!");
    }
    console.log(users);
  } catch (error) {
    console.log(error);
    sendStatus(500);
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
  try {
    const email = req.body.email;
    const password = req.body.password;
    let checkUser = users.some(
      (obj) => obj.email == email && obj.password == password
    );
    if (!checkUser) {
      res.sendStatus(401);
    } else {
      const payload = req.body;

      const secretKey = "123";

      const token = jwt.sign(payload, secretKey);
      res.status(200).send("TOKEN=" + token);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(questions);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(submissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const accepted = Math.random() < 0.5;
  submissions.push(req.body);
  if (accepted) res.send("Solution Accepted");
  else res.send("Solution Rejected");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
