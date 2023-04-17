const express = require("express");
const app = express();
const port = 3001;

const USERS = [];
const SUBMISSION = [];
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

// SIGNUP
app.post("/signup", function (req, res) {
  const { username, password } = req.body;

  // Check if user already exists
  const userExists = USERS.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Add new user to database
  const newUser = { username, password };
  USERS.push(newUser);

  res.status(201).json({ message: "Account Created Sucessfully." });
});

// LOGIN
app.post("/login", function (req, res) {
  const { username, password } = req.body;

  // Check if user exists
  const userExists = USERS.find((user) => user.username === username);
  if (!userExists) {
    return res.status(401).json({ error: "User not found" });
  }

  // Check if password is correct
  if (userExists.password !== password) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = "dfurb23jebf";

  USERS.push({ username, password });
  res
    .status(200)
    .json({ token: token, message: "Account Created Succesfully" });
});

// QUESTIONS
app.get("/questions", function (req, res) {
  const title = QUESTIONS.map((q) => q.title);
  const desc = QUESTIONS.map((q) => q.description);
  const testCases = QUESTIONS.map((q) => q.testCases);
  res.json({ title, desc, testCases });
});

// SUBMISSIONS
app.get("/submissions", function (req, res) {
  const sub = req.body;
  // We will check if the solution is accepeted or rejected using checkStatus Function
  // const probStatus = checkStatus(sub);

  res.json({ status: probStatus });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { probId, solution } = req.body;
  // simulate a random acceptance/rejection of the submission
  const isAccepted = Math.random() < 0.5;

  const submission = {
    probId: probId,
    solution: solution,
    isAccepted: isAccepted,
  };
  SUBMISSION.push(submission);
  res.status(200).json({
    message: isAccepted ? "Submission accepted!" : "Submission rejected.",
  });
});

//  ADDING QUESTIONS
const ADMIN = []; // Creating a different admin list

app.post("./admin/add", function (req, res) {
  // Assuming we can access email and password
  const { username, password, title, desc, testCases } = req.body;

  const isVerified = ADMIN.find(
    (user) => user.username === username && user.password === password
  );

  if (!isVerified) {
    return res
      .status(401)
      .json({ error: "you are not authorized to make changes" });
  }

  const question = {
    id: QUESTIONS.length + 1,
    title: title,
    description: desc,
    testCases: testCases,
  };

  QUESTIONS.push(question);
  res.status(200).json({
    title: title,
    description: desc,
    message: "Question Added Successfully!",
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
