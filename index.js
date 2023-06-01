const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;

//middleware
app.use(cors());
app.use(express.json());

let CURRENT_USER = "";

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
  const { email, password } = req.body;

  if (!USERS.some((v) => v.email === email)) {
    USERS.push({ email, password });
    res.status(200).send("Email Registered");
  } else {
    res.status(401).send("Already Registered");
  }
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  if (USERS.some((v) => v.email === email && v.password === password)) {
    CURRENT_USER = email;
    res.status(200).send("Successfully Logged In");
  } else {
    res.status(401).send("Wrong Password or Email");
  }
});

app.get("/questions", function (req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  res.json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  const { value } = req.body;
  SUBMISSION.push(value);
  res
    .status(200)
    .send(value.length % 2 === 0 ? "Success" : "Test Cases Failed");
});

app.post("/questions", function (req, res) {
  // Emails ending with parth.com will only have access to create questions
  if (CURRENT_USER.match(/parth.com$/gm)) {
    const { title, description, testCases } = req.body;
    QUESTIONS.push({ title, description, testCases });
    res.json(QUESTIONS);
  } else {
    res.status(401).send("You dont have the permission to create questions");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
