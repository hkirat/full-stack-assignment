const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
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

app.post("/signup", async function (req, res) {
  const { email, password } = req.body;
  const userCheck = USERS.find((user) => user.email == email);
  if (userCheck) {
    res
      .status(400)
      .json({ status: "Error", message: "user already exist with this email" });
  } else {
    const encryptpassword = await bcrypt.hash(password, 10);
    USERS.push({ email, encryptpassword });
    const token = jwt.sign(email, "secret", { expiresIn: "30d" });
    res.status(200).json({
      status: "Success",
      data: { message: "Signup Successful", token: token },
    });
  }
  // Add logic to decode body
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  const userCheck = USERS.find((user) => user.email == email);
  if (userCheck && (await bcrypt.compare(password, userCheck.password))) {
    const token = jwt.sign(email, "secret", { expiresIn: "30d" });
    res.status(200).json({
      status: "Success",
      data: { message: "Login Successful", token: token },
    });
  } else {
    res
      .status(400)
      .json({ status: "Error", message: "Invalid email or password" });
  }
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.send("Hello World from route 2!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ status: "Success", data: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json({ status: "Success", data: SUBMISSION });
});

app.post("/submissions", function (req, res) {
  const { problem, solution } = req.body;
  const random = Math.random();
  let status;
  if (random == 0) {
    status = "Accepted";
  } else {
    status = "Rejected";
  }
  SUBMISSION.push({ problem, solution, status });
  res.status(200).json({ status: "Success", message: status });
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/problems", (req, res) => {
  const { title, description, testCases } = req.body;
  const token = req.headers.authorization;
  const { email } = jwt.verify(token, "secret");
  const user = USERS.find((user) => user.email == email);
  if (user && user.isAdmin) {
    res.status(200).json({ message: "problem added Successful" });
  } else {
    res.status(400).json({ message: "Unauthorized" });
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
