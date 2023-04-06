const express = require("express");
const app = express();
const port = 3000;

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

  {
    title: "Two states",
    description: "Given an array , return the minimum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "1",
      },
    ],
  },

  {
    title: "Two states",
    description: "Given an array , return the sum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "15",
      },
    ],
  },

  {
    title: "Two states",
    description: "Given an array , return the product of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "120",
      },
    ],
  },
];

const SUBMISSION = [];

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  const { token } = req.headers;

  if (!token || token !== "admin") {
    return res.status(401).send("Unauthorized");
  }

  next();
}

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (!email || !password) {
    // return back 400 status code to the client
    return res.status(400).send("Email and password are required");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const userExists = USERS.some((user) => user.email === email);

  if (userExists) {
    return res.status(400).send("User already exists");
  }

  USERS.push({ email, password });

  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client

  if (!user || user.password !== password) {
    return res.status(400).send("Invalid email or password");
  }
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token = "Correct Credentials";
  res.status(200).send({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { problemId } = req.query;

  const submissions = SUBMISSION.filter(
    (submission) => submission.problemId === problemId
  );

  res.send(submissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { problemId } = req.body;
  const isAccepted = Math.random() >= 0.5;
  const newSubmission = {
    problemId,
    solution: req.body.solution,
    isAccepted,
  };
  SUBMISSION.push(newSubmission);
  res.status(200).send(`Solution ${isAccepted ? "accepted" : "rejected"}.`);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/problems", isAdmin, function (req, res) {
  // Add a new problem to the QUESTIONS array
  // Only admins can do that
  const { title, description, testCases } = req.body;

  if (!title || !description || !testCases) {
    return res
      .status(400)
      .send("Title, description and test cases are required");
  }

  QUESTIONS.push({ title, description, testCases });
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
