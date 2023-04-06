const express = require("express");
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

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  const { email, password } = req.body;
  console.log(req.body);
  const user = USERS.find((user) => user.email === email);
  if (user) {
    res.status(400).send("User already exists");
  } else {
    USERS.push({ email, password });
    res.status(200).send("User created");
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);
  if (user && user.password === password) {
    res.status(200).send("User logged in");
  } else {
    res.status(401).send("User not logged in");
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const problemId = req.query.problemId;
  const obj = [];
  SUBMISSION.forEach((submission) => {
    if (submission.problemId === problemId) {
      obj.push(submission);
    }
  });
  res.json(obj);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const problemId = req.query.problemId;
  const submissionId = req.query.submissionId;
  const code = req.query.code;
  const obj = { problemId, submissionId, code };
  SUBMISSION.push(obj);
  res.statusCode(200).send("Submission successful");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin/addProblem", function (req, res) {
  if (isAdmin()) {
    const { title, description, testCases } = req.body;
    const obj = { title, description, testCases };
    QUESTIONS.push(obj);
    res.status(200).send("Problem added");
  } else {
    res.status(401).send("Not authorized");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

const isAdmin = () => true;
