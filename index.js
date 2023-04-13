const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
require("dotenv").config();
const port = 3001;
const { errorHandler } = require("./middleware/errorMiddleware");

app.use(express.json());

//authorization
function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  jwt.verify(token, process.env.JWTSecretKey, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }

    req.username = decoded.username;
    next();
  });
}

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

app.post("/signup", async (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { username, email, password } = req.body;

  // To check if user exists
  const doesExists = USERS.find((user) => user.email == email);

  if (doesExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const user = USERS.push({
    username,
    email,
    password,
  });

  console.log(user);
  // return back 200 status code to the client
  if (user) {
    res.status(201).json({
      message: "Signup successful",
    });
  }
});

app.post("/login", async (req, res) => {
  // Add logic to decode body
  // body should have email and password

  const { username, email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const user = USERS.find((user) => user.email == email);

  if (!user) {
    return res.sendStatus(401).json({ message: "User not found" });
  }

  const isPassCorrect = password == user.password;
  if (!isPassCorrect) {
    return res.sendStatus(401).json({ message: "Wrong password" });
  }

  // Also send back a token (any random string will do for now)
  const token = jwt.sign({ id: username }, process.env.JWTSecretKey, {
    expiresIn: "7d",
  });

  res.cookie("token", token, { httpOnly: true });
  res.status(200).send({ success: true });
});

app.get("/questions", protect, function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", protect, function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", protect, function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(req.submissions);
  res.sendStatus(200).json({ message: "Submission successful" });
});

app.use(errorHandler);

app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
