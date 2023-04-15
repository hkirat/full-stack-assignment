const express = require("express");
const app = express();
app.use(express.json());
const port = 3001;

const USERS = [];

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

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  console.log(`email: ${email}, password: ${password}`);
  // console.log(`USERS:\n ${USERS}`);
  if (!email || !password) {
    res.status(400).send("Email and password must be provided");
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // If the user with the given email exists, return back 400 status code to the client
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    // return back 200 status code to the client
    USERS.push({ email, password });
    res.status(200).send(`User ${email} created`);
  } else {
    res.status(400).send("User already exists");
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(
    (user) => user.email === email && user.password === password
  );
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (!user) {
    res.status(401).send("Invalid credentials");
  } else {
    const token = Math.random().toString(36).substring(7);
    const obj = {
      token: token,
      Message: "Login successful",
    };
    res.status(200).send(obj);
  }

  // res.send("Hello World from route 2!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array

  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { email } = req.body;
  const submissions = [];
  SUBMISSION.forEach((submission) => {
    if (submission.email === email) {
      submissions.push(submission);
    }
  });
  res.send(submissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution

  const { email, questionId, code } = req.body;

  // Check if the question with the given questionId exists in the QUESTIONS array

  // If the question does not exist, return back 400 status code to the client

  // If the question exists, randomly accept or reject the solution

  // If the solution is accepted, return back 200 status code to the client

  const question = QUESTIONS.find((question) => question.id === questionId);
  if (!question) {
    res.status(400).send("Invalid question");
  } else {
    const isAccepted = Math.random() > 0.5;
    if (isAccepted) {
      res.status(200).send("Accepted");
    } else {
      res.status(200).send("Rejected");
    }
  }

  const submission = {
    email,
    questionId,
    code,
    isAccepted,
  };

  SUBMISSION.push(submission);

  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
