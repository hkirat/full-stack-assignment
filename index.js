const express = require("express");
const app = express();
const port = 3001;

const EMAIL = "@neetcode.com";
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

function isAdmin(req, res, next) {
  const { email } = req.body.email;
  const admin = EMAIL.split("@")[1];
  if (email.includes(email.split("@")[1]) == admin) {
    next();
  } else {
    res.status(401).send("You Are not Admin");
  }
}

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  if (!email || !password) {
    res.status(404).send("Email or Password Not Found!");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const checkUser = USERS.find((user) => user.email == email);

  if (!checkUser(email)) {
    USERS.push({
      email: email,
      password: password,
    });
    res.status(201).send("User accound has been sucessfully created.");
  } else {
    res.status(401).send("User Already Exist");
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  if (!email || !password) {
    res.status(404).send("Email or Password Not Found.");
  }
  // Check if the user with the given email exists in the USERS array
  const checkUser = USERS.find((user) => user.email == email);

  if (!checkUser) {
    return res.status(401).send("Invalid Email and Password!");
  }
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)

  // If the password is not the same, return back 401 status code to the client

  const checkPassword = USERS.find(
    (user) => user.email == email && user.password == password
  );

  if (checkPassword) {
    const accessToken = Math.random().toString(36).substring(2, 20);
    res.status(200).send(accessToken);
  } else {
    return res.status(401).send("Invalid Email and Password!");
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem,
  const submission = req.body;
  // randomly accept or reject the
  const isAccepted = Math.random() < 0.5 ? 0 : 1;
  SUBMISSION.push(isAccepted);
  // Store the submission in the SUBMISSION array above
  if (isAccepted) {
    res.status(200).send("Submission Accepted.");
  } else {
    res.status(200).send("Submission rejected.");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/v2/Problem", isAdmin, function (req, res) {
  const { problem } = req.body;
  QUESTIONS.push(problem);

  res.status(200).send("Problem added sucessfully.");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
