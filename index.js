// imports
const express = require("express");
const bcryptjs = require("bcryptjs");

// inits
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3001;

const USERS = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: "12345678",
    user_type: "admin",
  },
];

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

// routes
app.post("/signup", async function (req, res) {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  if (USERS.find((user) => user.email === email)) {
    return res.status(400).json({
      message: "User with given email already exists",
    });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    user_type: "user",
  };
  USERS.push(newUser);

  res.status(200).json({
    message: "User created successfully!",
    user: newUser,
  });
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;

  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials!",
    });
  }

  const isPasswordValid =
    user.user_type === "admin"
      ? password === user.password
      : await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid credentials!",
    });
  }

  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const updatedUser = {
    name: user.name,
    email: user.email,
    token: token,
  };

  res.json({
    message: "Login successful!",
    user: updatedUser,
  });
});

app.get("/questions", function (req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  res.json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  const isAccepted = Math.random() > 0.5;
  const solution = {
    ...req.body,
    accepted: isAccepted,
  };
  SUBMISSION.push(solution);
  res.status(200).json({
    message: `Your submission is ${isAccepted ? "accepted" : "rejected"}!`,
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
