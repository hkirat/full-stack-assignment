const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

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
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const isPresent = USERS.some(
    (obj) => obj.email === user.email && obj.password === user.password
  );

  if (isPresent) {
    console.log("Already Exists");
    res.status(200).redirect("/login");
  } else {
    USERS.push(user);
    console.log(USERS);
    res.status(200).redirect("/login");
  }

  // if (!USERS.includes(user)) {
  //   USERS.push(user);
  //   console.log(USERS);
  //   res.redirect("/signup");
  // } else {
  //   USERS.push(user);
  //   console.log("Already Exists");
  //   res.redirect("/signup");
  // }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const isPresent = USERS.some(
    (obj) => obj.email === user.email && obj.password === user.password
  );

  if (isPresent) {
    console.log("Login Successful");
    res.status(200);
  } else {
    console.log("New User");
    res.status(401);
  }
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  // res.send("Hello World from route 3!");
  res.status(401).send("kaam khatam");
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
