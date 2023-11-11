const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());

const USERS = [{ userName: "saharsh", password: "123" }];

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

app.post("/signup", function (req, res) {
  const { userName, password } = req.body;
  if (userName && password) {
    const existingUser = USERS.find((user) => user.userName === userName);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    } else {
      const newUser = { userName: userName, password: password };
      USERS.push(newUser);
      return res.status(200).json({ message: "Thing created successfully!" });
    }
  } else {
    return res.status(400).json({ message: "email / username is empty" });
  }
});

app.post("/login", function (req, res) {
  console.log(USERS);
  const { userName, password } = req.body;
  const user = USERS.find((user) => user.userName === userName);
  if (user) {
    if (password === user.password) {
      res.status(200).json({ message: "LoggedIn successfully" });
    } else {
      res.status(400).json({ message: "Password is wrong" });
    }
  } else {
    res.status(400).json({ message: "User not exist" });
  }
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json({ submissions: SUBMISSION });
});

app.post("/submissions", function (req, res) {
  const { answer } = req.body;
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const value = Math.floor(Math.random() * 11);
  if (value <= 5) {
    SUBMISSION.push({ answer: answer });
    res.status(200).json({ message: "Answer submitted successfully" });
  } else {
    res.status(400).json({ message: "Answer is wrong" });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
