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
  if (!req.body || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .send("Bad Request: email and password fields are required");
  }

  const { email, password } = req.body;

  const userExists = USERS.some((user) => user.email === email);

  if (userExists) {
    return res
      .status(409)
      .send("Conflict: user with the given email already exists");
  }

  USERS.push({ email, password });

  res.status(200).send("User created successfully");
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(401).send("Unauthorized: invalid email or password");
  }
  if (user.password === password) {
    const token = Math.random().toString(36).substring(2);
    user.token = token;
    return res.status(200).send({ token });
  } else {
    return res.status(401).send("Unauthorized: invalid email or password");
  }
});

app.get("/questions", function (req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  res.send(SUBMISSION);
  res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  const { problem, solution } = req.body;
  if (!problem || !solution) {
    return res
      .status(400)
      .json({ message: "problem and solution is required" });
  }
  const isAccepted = Math.random() >= 0.5;
  SUBMISSION.push({ problem, solution, isAccepted });
  const message = isAccepted
    ? "your sol is accepted!"
    : "sorry your sol is not accepted";
  res.status(200).json({ message });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
