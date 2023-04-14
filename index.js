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
];

const SUBMISSION = [];

app.use(express.json());

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  const user = USERS.find((u) => u.email === email);
  if (user) {
    return res.status(409).send("User already exists");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({ email, password });

  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const token = Math.random().toString(36).substring(2);
  res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.json(SUBMISSIONS);
});

app.post("/submissions", function (req, res) {
  const submission = req.body;
  // let the user submit a problem, randomly accept or reject the solution
  const accepted = Math.random() < 0.5;
  // Store the submission in the SUBMISSION array above
  SUBMISSIONS.push({ ...submission, accepted });

  res.sendStatus(200);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.post("/problems", function (req, res) {
  const { title, description, testCases } = req.body;

  const isAdmin = true;

  if (!isAdmin) {
    return res.sendStatus(403);
  }

  QUESTIONS.push({ title, description, testCases });

  res.sendStatus(200);
});
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
