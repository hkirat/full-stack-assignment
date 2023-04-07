const express = require("express");
const app = express();
const port = 3001;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

app.post("/signup", async function (req, res) {
  try {
    const userExists = await USERS.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new USERS(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

app.post("/login", async function (req, res) {
  try {
    const user = await USERS.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});

app.get("/questions", function (req, res) {
  res.send(
    QUESTIONS.map((question, index) => ({ problemId: index, ...question }))
  );
  res.send("Hello World from route 3!");
});

app.get("/submissions", async function (req, res) {
  const user = await USERS.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send("Unauthorized");
  }
  const { email } = req.body;
  const userSubmission = SUBMISSION.filter(
    (submission) => submission.email === email
  );

  res.status(200).send(userSubmission);
});

app.post("/submissions", function (req, res) {
  const { email, problemId, solution } = req.body;

  const isAccepted = Math.random() < 0.5;

  SUBMISSION.push({ email, problemId, solution, isAccepted });

  res.status(200).send({ isAccepted });
});

app.post("/problems", async function (req, res) {
  const user = await USERS.findOne({ role: "admin" });
  if (!user) {
    return res.status(401).send("Unauthorized");
  } else {
    const { title, description, testCases } = req.body;
    const question = { title, description, testCases };
    QUESTIONS.push(question);
    res.status(200).send("Question added successfully");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
