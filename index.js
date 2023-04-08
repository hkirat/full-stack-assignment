const express = require("express");
const crypto = require("crypto");

const app = express();
const port = 3001;

app.use(express.json());

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

const SUBMISSIONS = [];

const getUser = (email) => {
  return USERS.find((user) => user.email === email);
};

const hasCorrectBodyMiddleware = (req, res, next) => {
  const { body } = req;

  if (!body) {
    res.status(500).send("Body must not be empty");
    return;
  }

  const { email, password } = body;

  if (!email || !password) {
    res.status(500).send("Body must include email and password");
    return;
  }

  next();
};

app.post("/signup", hasCorrectBodyMiddleware, function (req, res) {
  // Add logic to decode body
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const {
    body: { email, password },
  } = req;

  const user = getUser(email);

  if (user) {
    res.status(400).send("Email already exists");
    return;
  }

  // return back 200 status code to the client
  USERS.push({ email, password, id: USERS.length + 1 });
  res.status(200).send("Successfully signed up!");
});

app.post("/login", hasCorrectBodyMiddleware, function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const {
    body: { email, password },
  } = req;

  const user = getUser(email);

  if (!user) {
    res.status(401).send("User with the given credentials does not exist");
    return;
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if (user.password !== password) {
    res.status(401).send("Password is incorrect");
    return;
  }

  res.status(200).send({
    userToken: crypto.randomBytes(20).toString("hex"),
    userId: user.id,
  });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions/", function (req, res) {
  if (!query.length) {
    res
      .status(400)
      .send("Request must include userId and questionId query params");
    return;
  }

  const { questionId, userId } = query;

  const userSubmissions = SUBMISSIONS.filter(
    (submission) =>
      submission.questionId === questionId && submission.userId === userId
  );

  // return the users submissions for this problem
  res.send(userSubmissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSIONS array above
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
