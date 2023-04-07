const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

const app = express();
const port = 3001;

app.use(bodyParser.json());

const USERS = [
  {
    id: "8bc97b69-4760-45fd-b027-c39a20cf20e0",
    email: "sb@email.com",
    password: "sb@123",
    isAdmin: false,
  },
  {
    id: "8d9bc1b5-814f-4519-8224-f3cbe34f8dfd",
    email: "sbadmin@email.com",
    password: "sbadmin@123",
    isAdmin: true,
  },
];

const QUESTIONS = [
  {
    id: 1,
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
    problemId: 1,
    userId: "8bc97b69-4760-45fd-b027-c39a20cf20e0",
    code: "code goes here",
  },
];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  let { email, password } = req.body;
  // body should have email and password
  if (!email)
    return res
      .status(400)
      .json({ error: ["please provide email to continue"] });
  if (!password)
    return res
      .status(400)
      .json({ error: ["please provide password to continue"] });

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let foundUser = USERS.find((user) => user.email == email);
  if (foundUser)
    return res.status(400).json({ error: ["user already exists"] });

  USERS.push({
    id: v4(),
    email,
    password,
    isAdmin: req.body.isAdmin ? true : false,
  });
  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  let { email, password } = req.body;

  // body should have email and password
  if (!email)
    return res
      .status(400)
      .json({ error: ["please provide email to continue"] });
  if (!password)
    return res
      .status(400)
      .json({ error: ["please provide password to continue"] });

  // Check if the user with the given email exists in the USERS array
  let foundUser = USERS.find((user) => user.email == email);
  if (!foundUser) return res.status(404).json({ error: ["user not found"] });
  // Also ensure that the password is the same
  let passwordMatched = foundUser.password === password;
  if (!passwordMatched)
    return res.status(401).json({ error: ["invalid credentials"] });

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  let accessToken = jwt.sign({ email }, "VERYSECRETIVESTRINGFORACCESSTOKEN", {
    expiresIn: "1h",
  });
  let refreshToken = jwt.sign({ email }, "VERYSECRETIVESTRINGFORREFRESHTOKEN", {
    expiresIn: "1y",
  });
  // If the password is not the same, return back 401 status code to the client
  res.cookie("rtc", refreshToken, { httpOnly: true, secure: true });
  res.status(200).json({ accessToken });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json({ submission: SUBMISSION });
});

app.use((req, res, next) => {
  let authToken = req.header("Authorization");
  if (!authToken)
    return res
      .status(401)
      .json({ error: ["please authentication first to continue"] });

  let token = authToken.split(" ")[1];
  jwt.verify(token, "VERYSECRETIVESTRINGFORACCESSTOKEN", (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: ["please re-authenticate first"] });
    }
    let foundUser = USERS.find((user) => user.email === decoded.email);
    req.user = foundUser;
    next();
  });
});
app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  let { problemId, code } = req.body;
  SUBMISSION.push({ problemId, code, userId: req.user.id });
  // Store the submission in the SUBMISSION array above
  res.sendStatus(201);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/create", (req, res) => {
  if (!req.user.isAdmin)
    return res.status(401).json({
      error: ["current user does not have permission to create question"],
    });

  QUESTIONS.push({
    id: QUESTIONS.length,
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases,
  });
  res.sendStatus(201);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
