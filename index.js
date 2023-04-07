const express = require("express");
const app = express();
const port = 3001;

var bodyParser = require('body-parser')
app.use(bodyParser.json())

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

const SUBMISSION = [
  {
    id: 1,
    userId: 1,
    problemId: 1,
    code: 'console.log("Hello, world!")',
    language: "JavaScript",
  },
  {
    id: 2,
    userId: 2,
    problemId: 1,
    code: 'print("Hello, world!")',
    language: "Python",
  },
  {
    id: 3,
    userId: 1,
    problemId: 2,
    code: "console.log(2 + 2)",
    language: "JavaScript",
  },
];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.some((user) => user.email === email);

  if (!userExists) {
    const newUser = { email, password };
    USERS.push(newUser);
    // return back 200 status code to the client
    return res.status(200).json({ message: "User created successfully" });
  } else {
    return res.status(400).json({ message: "User with email already exists" });
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);

  if (user && user.password === password) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = "RFNJJIHUGYGFFVHGVGCRDRTDFN";
    return res.status(200).json({ message: "Login successful", token });
  } else {
    // If the password is not the same, return back 401 status code to the client
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  return res.status(200).json({ questions: QUESTIONS });
});

app.get("/submissions/:userId/:problemId", function (req, res) {
  // return the users submissions for this problem
  const { userId, problemId } = req.params;
  const userSubmissions = SUBMISSION.filter(
    (submission) =>
      submission.userId === parseInt(userId) &&
      submission.problemId === parseInt(problemId)
  );

  return res.status(200).json({ submissions: userSubmissions });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution

  const { userId, problemId, code, language } = req.body;
  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSION array above
  const submission = {
    id: SUBMISSION.length + 1,
    userId: userId,
    problemId: problemId,
    code: code,
    language: language,
  };
  SUBMISSION.push(submission);

  return res.status(200).json({ submission: submission, isAccepted: isAccepted });
});

// leaving as hard todos
// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  const { userType } = req.body;
  if (userType === 'admin') {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/problems', isAdmin, (req, res) => {
  const { title, description, difficulty,testCases } = req.body;
  QUESTIONS.push({ title, description, difficulty,testCases });

  // Return a JSON response with the problem object
  return res.status(200).json({ message: 'New probelm has been added successfully' });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
