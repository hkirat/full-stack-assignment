const express = require("express");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const app = express();
const port = 3001;

const secret = "abcd4321";

const USERS = [];

const authorization = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    console.log(decoded);
    req.user = decoded.username;
    next();
  });
};

const adminAuthorization = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    req.user = decoded.username;
    if (decoded.userType !== "admin") {
      return res.status(401).send("Unauthorized");
    }
    next();
  });
};

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
  {
    id: 2,
    title: "Sum of array",
    description: "Given an array , return the sum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "15",
      },
    ],
  },
];

const SUBMISSION = [];

app.use(express.json());

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const body = req.body;
  const username = body["username"];
  const password = body["password"];

  if (USERS.find((user) => user.username === username)) {
    return res.status(400).send("User already exists");
  }

  USERS.push({
    username,
    password,
    userType: "user",
  });

  res.status(200).send("User created successfully");

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
});

app.post("/admin/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const body = req.body;
  const username = body["username"];
  const password = body["password"];

  if (USERS.find((user) => user.username === username)) {
    return res.status(400).send("User already exists");
  }

  USERS.push({
    username,
    password,
    userType: "admin",
  });

  res.status(200).send("User created successfully");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const body = req.body;
  const username = body["username"];
  const password = body["password"];

  const user = USERS.find((user) => user.username === username);
  if (!user) {
    return res.status(401).send("User does not exist");
  }

  if (user.password !== password) {
    return res.status(401).send("Invalid password");
  }

  console.log(username);
  jwt.sign(
    { username: username, userType: "user" },
    secret,
    function (err, token) {
      if (err) {
        return res.status(500).send("Internal server error");
      }
      res.status(200).send({ token });
    }
  );
});

app.post("/admin/login", function (req, res) {
  const body = req.body;
  const username = body["username"];
  const password = body["password"];

  const user = USERS.find((user) => user.username === username);
  if (!user) {
    return res.status(401).send("User does not exist");
  }

  if (user.password !== password) {
    return res.status(401).send("Invalid password");
  }

  if (user.userType !== "admin") {
    return res.status(401).send("Unauthorized");
  }

  jwt.sign({ username, userType: "admin" }, secret, function (err, token) {
    if (err) {
      return res.status(500).send("Internal server error");
    }
    res.status(200).send({ token });
  });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
});

app.get("/submissions", authorization, function (req, res) {
  const user = req.user;
  res
    .status(200)
    .send(SUBMISSION.filter((submission) => submission.user === user));
});

app.post("/submissions", authorization, function (req, res) {
  const user = req.user;
  const body = req.body;
  const questionId = body["questionId"];
  const code = body["code"];
  const isCorrect = Math.random() > 0.5;
  SUBMISSION.push({
    user,
    questionId,
    code,
    isCorrect,
  });

  // Randomly generate a boolean value

  res.status(200).send("Submission created successfully");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin/question", adminAuthorization, function (req, res) {
  const body = req.body;
  const title = body["title"];
  const description = body["description"];
  const testCases = body["testcases"];
  QUESTIONS.push({
    id: uuid.v4(),
    title,
    description,
    testCases,
  });
  console.log(QUESTIONS);
  res.status(200).send("Question created successfully");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
