const express = require("express");
var randomstring = require("randomstring");
const app = express();
const port = 3001;

let USERS = [];

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

const SUBMISSION = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    solution: (input) => {
      return Math.max(...input);
    },
    stringAnswer: `(input) => { return Math.max(...input);}`,
  },
];
app.use(express.urlencoded({ extended: true })); // this will parse the body of a post request :)
app.post("/signup", function (req, res) {
  // Add logic to decode body
  let { email, password } = req.body;
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let _found = 0;
  for (let x of USERS) {
    if (x.email === email) _found = 1;
  }
  if (_found === 0) {
    USERS.push({ email, password });
    return res.status(200).send("User added successfully");
  }
  res.status(400).send("User already exists");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  let { email, password } = req.body;
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  let _found = 1;
  let emailFound = 0;
  for (let x of USERS) {
    if (x.email === email) emailFound = 1;
    if (x.email === email && x.password === password) _found = 0;
  }
  if (_found === 0) {
    return res.status(200).send(randomstring.generate(25));
  }
  if (emailFound === 0) {
    return res.status(400).send("User does not exist");
  }
  res.status(401).send("User Incorrect Password");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  res.json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  console.log(SUBMISSION);
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  let answer = Math.floor(Math.random() * 2);
  if (answer === 1) {
    SUBMISSION.push(req.body);
    return res.status(200).send("Accepted");
  }
  return res.status(200).send("Rejected");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// admin will send different parameter in the body of the request, if adminKey === "https://github.com/SomSingh23" then only add problem
app.post(
  "/admin/create/question",
  (req, res, next) => {
    console.log(QUESTIONS);
    if (req.body.adminKey === "https://github.com/SomSingh23") {
      return next();
    }
    return res.status(401).send("Unauthorized");
  },
  (req, res) => {
    QUESTIONS.push({ title: req.body.title, question: req.body.question });
    return res.status(200).send("Question added successfully");
  }
);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
