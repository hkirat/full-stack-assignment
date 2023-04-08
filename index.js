const express = require("express");
const crypto = require("crypto");

const app = express();
const port = 3001;

app.use(express.json());

const USERS = [];

const LOGGED_IN_USERS = [];

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

const SUBMISSIONS = [];

const getUser = (email) => {
  return USERS.find((user) => user.email === email);
};

const authenticationBodyMiddleware = (req, res, next) => {
  const { body } = req;

  if (!body) {
    return res.status(500).send("Body must not be empty");
  }

  const { email, password } = body;

  if (!email || !password) {
    return res.status(500).send("Body must include email and password");
  }

  next();
};

const authenticationMiddleware = (req, res, next) => {
  // used to authenticate request

  const {
    headers: { token },
  } = req;

  if (!token) {
    return res.status(401).send("Request must contain token");
  }

  const user = LOGGED_IN_USERS.find((userObj) => userObj.token === token);

  if (!user) {
    return res.status(401).send("User not logged in");
  }

  next();
};

app.post("/signup", authenticationBodyMiddleware, function (req, res) {
  // Add logic to decode body
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const {
    body: { email, password },
  } = req;

  const user = getUser(email);

  if (user) {
    return res.status(400).send("Email already exists");
  }

  // return back 200 status code to the client
  USERS.push({ email, password, id: USERS.length + 1 });
  res.status(200).send("Successfully signed up!");
});

app.post("/login", authenticationBodyMiddleware, function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const {
    body: { email, password },
  } = req;

  const user = getUser(email);

  if (!user) {
    return res
      .status(401)
      .send("User with the given credentials does not exist");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if (user.password !== password) {
    return res.status(401).send("Password is incorrect");
  }

  const userResponse = {
    token: crypto.randomBytes(20).toString("hex"),
    userId: user.id,
  };

  LOGGED_IN_USERS.push(userResponse);

  res.status(200).send(userResponse);
});

app.get("/questions", authenticationMiddleware, function (req, res) {
  //return the user all the questions in the QUESTIONS array
  return res.send(QUESTIONS);
});

app.get("/submissions/", authenticationMiddleware, function (req, res) {
  const { query } = req;

  if (!query.length) {
    return res
      .status(400)
      .send("Request must include userId and questionId query params");
  }

  const { questionId, userId } = query;

  const userSubmissions = SUBMISSIONS.filter(
    (submission) =>
      submission.questionId === questionId && submission.userId === userId
  );

  // return the users submissions for this problem
  return res.send(userSubmissions);
});

app.post("/submissions", authenticationMiddleware, function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSIONS array above
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
