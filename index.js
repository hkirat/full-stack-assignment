const express = require("express");
const app = express();
const port = 3000;

const USERS = [];

const QUESTIONS = [
  {
    problemId: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    problemId: 2,
    title: "Min Num",
    description: "Given an array , return the min of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "1",
      },
    ],
  },
];

const SUBMISSION = [];

checkUserExist = (email) => {
  return USERS.some((user) => user.email === email);
};

checkPassword = (email, password) => {
  return USERS.some(
    (user) => user.email === email && user.password === password
  );
};

// POST: /signup route
app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    res.status(401).send("email and password are required");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!checkUserExist(email)) {
    USERS.push({
      email: email,
      password: password,
    });
    res.status(200).send("user credentials succesfully created");
  } else {
    res.status(401).send("user already exists, do login with your credentials");
  }

  // return back 200 status code to the client
  res.status(200);
});

// POST: /login route
app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    res.status(401).send("signup first");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (checkUserExist(email)) {
    if (checkPassword(email, password)) {
      // If the password is the same, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      let token = Math.random().toString(36).substr(2);
      res.send(token);
      res.status(200).send("sucessfully logged in");
    } else {
      // If the password is not the same, return back 401 status code to the client
      res.status(401).send("email or password is incorrect");
    }
  } else {
    res.status(401).send("user does not exists");
  }
});

// GET: /questions route
app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

// GET: /submissions route
app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

// POST: /submissions route
app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { problemId, solution } = req.body;

  const isAccepted = Math.random() < 0.5;
  const submission = {
    problemId,
    solution,
    isAccepted,
  };
  SUBMISSION.push(submission);
  res.status(200).send({ status: isAccepted ? "accepted" : "rejected" });
});

// authentication to check whether the user is a valid user and admin
const authenticate = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send("username and password required");

  if (username !== "admin" || password !== "adminPassword")
    return res.status(401).send("Unauthorized");

  next();
};

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// POST: /questions route
app.post("/questions", authenticate, (req, res) => {
  const { problemId, title, description, testCases } = req.body;
  if (!problemId || !title || !description || !testCases)
    return res.status(400).send("please provide required params");

  const question = { problemId, title, description, testCases };
  QUESTIONS.push(question);
  res.status(200).send("Problem added");
});

app.listen(port, function () {
  console.log(`leetcode clone app listening on port ${port}`);
});
