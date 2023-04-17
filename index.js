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
//helper function
function userExists(email) {
  return USERS.some((user) => user.email === email);
}
app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  if (userExists(email)) {
    res.status(500).send("User already exists");
  } else {
    USERS.push({ email, password });
    res.sendStatus(200);
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
  println;
  res.send("Hello World!");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    //User not found
    res.status(404).send("Invalid email or password");
  } else if (user.password === password) {
    const token = Math.random().toString(36); //  random string
    res.status(200).json({ token });
  } else {
    res.status(401).send("Invalid email or password");
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.send("Hello World from route 2!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ QUESTIONS });
  res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const questionTitle = req.query.title;
  const submission = SUBMISSION.filter(
    (submissison) => submissison.questionTitle === questionTitle
  );
  res.status(200).json(submission);
  res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { questionTitle, solution } = req.body;
  const isAccepted = Math.random() < 0.5;
  if (isAccepted) {
    SUBMISSION.push(questionTitle, solution);
  } else {
    res.status(404).send("Not a vlaid solution");
  }
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
function isAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.isAuthenticated) {
    res.status(403).send("Unauthorized");
  } else {
    next();
  }
}
app.post("/problem", function (req, res) {
  const { title, description, testCases } = req.body;
  if (isAdmin) {
    QUESTIONS.push(title, description, testCases);
  } else {
    res.status(404).send("You are not authorized");
  }
});
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
