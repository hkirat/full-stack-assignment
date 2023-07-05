const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { debounce } = require("@mui/material");
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array.",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSIONS = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)

  // return back 200 status code to the client

  // Adding a rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum of 5 signup attempts within the defined window
    message: "Too many signup attempts from this IP. Please try again later.",
  });

  const { email, password } = req.body;
  // email validation regex pattern.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // password validation regex pattern
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!emailRegex.test(email)) {
    // email condition failed.
    return res.status(400).json({ error: "Invalid email format! Try again." });
  }

  if (!passwordRegex.test(password)) {
    // password condition failed.
    return res
      .status(400)
      .json({ error: "Invalid password format! Try again." });
  }

  // Adding a check if user with the same email already exists.
  if (USERS.some((user) => user.email === email)) {
    return res.status(400).json({
      error: "User with this email already exists! Please continue to login.",
    });
  }

  // Adding new user after all constraint checks.
  const userID = USERS.length + 1;
  const newUser = {
    id: userID,
    email,
    password,
  };

  USERS.push(newUser);
  //  returning with a success status code.
  res.status(200).json({ message: "Registered successfully!" });
  console.log(USERS);
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);
  console.log(user);
  if (!user) {
    // No such user exists
    return res.status(401).json({ error: "No such user exists" });
  } else {
    if (user.password !== password) {
      return res
        .status(401)
        .json({ error: "Login not successful! Password is not correct." });
    } else {
      res.cookie("sessionToken", 100, {
        httpOnly: true,
        secure: true,
      });
      return res.status(200).json({ message: "Login successful." });
    }
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});

app.get("/questions", function (req, res) {
  // return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users' submissions for this problem
  res.send(SUBMISSIONS);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSIONS array above
  const answer = req.body;
  SUBMISSIONS.push(answer);
  res.send("Answer submitted successfully");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
