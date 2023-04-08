const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = 3001;

//MIDDLEWARES
app.use(bodyParser.json()); // Middleware to parse body.

app.use(
  session({
    //Middleware to set session.
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

const requireLogin = (req, res, next) => {
  // Checking authorization on requests.
  if (req.session && req.session.user) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    res.status(401).send("Please Login to continue");
  }
};

//USERS Array to store user information.
const USERS = [];

//List of admins.
const ADMINS = [];

const QUESTIONS = [
  {
    id: 0,
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
  console.log(req.body);
  const newUser = {
    email: req.body.email,
    password: req.body.password,
  };

  //Checking email already exit or not.
  const doesEmailAlredyExits = USERS.find(
    (user) => user.email === newUser.email
  );

  if (doesEmailAlredyExits) {
    res.send("Email already exits. Try with a different email");
  } else {
    USERS.push(newUser); //Adding new user to USERS Array
    res.status(200); //returning 200 status code.
    res.send("Acoount created sucessfully...");
    // res.redirect('/login');//Redirecting to login page.
  }
});

app.post("/login", function (req, res) {
  const Currentuser = {
    email: req.body.email,
    password: req.body.password,
  };

  const isUserPresent = USERS.find(
    (user) =>
      user.email === Currentuser.email && user.password === Currentuser.password
  );

  if (isUserPresent) {
    req.session.user = Currentuser.email;
    res.status(200);
    res.send("Login Sucessfull...");
  } else {
    res.status(401);
    res.send("Login details incorrect.Retry!");
  }
});

app.get("/questions", requireLogin, function (req, res) {
  console.log(req.session.user);
  res.status(200).send(QUESTIONS);
});

app.get("/submissions", requireLogin, function (req, res) {
  const questionID = req.body.questionID;
  const submissions = SUBMISSION.filter(
    (sub) =>
      sub.questionId === questionID && req.session.user === sub.submittedBy
  );
  console.log(submissions);
  res.status(200).send(submissions);
});

app.post("/submissions", requireLogin, function (req, res) {
  const newSubmission = {
    submittedBy: req.session.user,
    questionId: req.body.questionId,
    submittedAnswer: req.body.submittedAnswer,
    isRejected:
      Math.floor(Math.random() * 11) % 2 === 0 ? "Rejected" : "Accepted", // Randomly accepting or rejecting the submission
  };
  res.status(200).send("Submitted Sucessfully....");
  SUBMISSION.push(newSubmission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
