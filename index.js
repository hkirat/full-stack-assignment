const express = require("express");
const ejs = require("ejs");
const path = require("path");
const { access } = require("fs");

const app = express();
const port = 3001;

const ADMIN = { email: "janedoe@admin", password: "000000" };

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

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// middleware
const isAdmin = (req, res, next) => {
  const { email, password } = req.body;
  if (email === ADMIN.email && password === ADMIN.password) {
    return next();
  }
  res.send("You dont have access to this route");
};

app.get("/signup", (req, res) => {
  res.render("users/signup");
});

app.get("/login", (req, res) => {
  res.render("users/login");
});

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client

  const { email, password } = req.body;

  for (let user of USERS) {
    if (user.email === email) {
      console.log("email already exists");
      return res.redirect("/login");
    }
  }
  USERS.push(req.body);
  res.status(200).redirect("/questions");
});

app.post("/login", function (req, res) {
  // Add logic to decode body  - DONE
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const { email, password } = req.body;

  for (let user of USERS) {
    if (user.email === email && user.password === password) {
      return res.status(200).send("Congratulations, you are logged in!");
    }
  }
  res.send(401);
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.render("questions", { questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.render("submissions", { submissions: SUBMISSION });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  const accepted = () => Math.random();

  if (accepted()) {
    SUBMISSION.push(req.body.submission);
    return res.redirect("/submissions");
  }
  res.redirect("/questions");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// at the moment this will only work if request to the route is send via postman with body
app.get("/newQuestions", isAdmin, (req, res) => {
  res.send("Add new questions here");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
