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
];

app.use(express.json());

const SUBMISSION = [];
app.get("/", (req, res) => {
  res.send("hello");
});
app.post("/signup", (req, res) => {
  res.send("sign up");
  if (!req.body.email || !req.body.password) {
    res.status(400).send("email and password are required");
  } else {
    const existingUser = USERS.find((user) => user.email === req.body.email);
    if (existingUser) {
      res.status(409).send("User already exist");
    } else {
      USERS.push({
        email: req.body.email,
        password: req.body.password,
      });
      res.status(201).send("user createed");
    }
  }
});

app.post("/login", (req, res) => {
  //we took the email and pass from the req body
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and pass are required" });
  }
  const existingUser = USERS.find((user) => user.email === email);
  const existingUserPass = USERS.find((pass) => pass.password === password);
  if (!existingUser) {
    return res.status(401).send("Invalid email of password");
  }
  if (!existingUserPass) {
    return res.status(401).send("Invalid email or password");
  }
  if (existingUser && existingUserPass) {
    return res.status(201).send("successfully logged in");
  }
  const rtoken = existingUser && existingUserPass;
  if (rtoken) {
    const token = "some_random_token";
    res.status(200).json({ token });
  }
});

app.get("/questions", (req, res) => {
  res.json({ QUESTIONS });
});

app.get("/submission", (req, res) => {
  res.send(SUBMISSION);
});
app.post("/submissions", (req, res) => {
  SUBMISSION.push(req.body.submissions);
  res.status(200).json({ message: "submission successful" });
});

app.listen(port, () => {
  console.log("hello world");
});
