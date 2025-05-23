const express = require("express");
const app = express();
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
  {
    title: "Sum of Array",
    description: "Given an array of number, return the sum of all elements",
    testCases: [
      {
        input: "[1, 2, 3]",
        output: "[6]",
      },
    ],
  },
  {
    title: "Palindrome Checker",
    description: "Return true if the input string is a palindrome.",
    testCases: [{ input: "madam", output: "true" }],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const existingUser = USERS.find((user) => user.email === email);
  if (!userExist) {
    USERS.push({ email, password });
  }

  // return back 200 status code to the client
  res.status(200).send("User created");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);

  // If the password is not the same, return back 401 status code to the client
  if (!user || user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = Math.random().toString(36).substring(7);
  res.status(200).send({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { userId, questionsId, solution } = req.body;

  if (!userId || !questionsId || !solution) {
    return res.status(400).send("Missing required fields");
  }
  // Store the submission in the SUBMISSION array above
  const submission = {
    userId,
    questionsId,
    solution,
    status: Math.random() < 0.5 ? "Accepted" : "Rejected",
  };

  SUBMISSION.push(submission);
  res.status(200).send(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
app.post("/questions", function (req, res) {
  const { token, title, description, testCases } = req.body;

  if (token !== ADMIN_TOKEN) {
    return res.status(403).send("Not authorized");
  }
  if (!title || !description || !testCases) {
    return res.status(400).send("Missing required fields");
  }

  const questions = { title, description, testCases };
  QUESTIONS.push(questions);
  res.status(200).send(questions);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
