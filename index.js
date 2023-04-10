const express = require("express");
const app = express();
const port = 3001;
const { ValidateEmail } = require("./utils/index");

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
  {
    id: 2,
    title: "Question 2",
    description: "Desc for Q 2",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5, 6]",
        output: "6",
      },
    ],
  },
];

const SUBMISSIONS = [];

app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password, role } = req.body;

  // body should have email and password
  if (!email || !password)
    return res.status(400).send("Bad request missing field  email or password");

  if (!ValidateEmail(email)) return res.status(400).send("Enter a valid email");
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const user = {
    id: USERS.length + 1,
    email,
    password,
    role: role ? role : "user",
  };
  const userExist = USERS.find((u) => u.email === user.email);

  if (userExist)
    return res.status(409).send("User with this email already exist");

  USERS.push(user);
  // return back 200 status code to the client
  res.status(201).send(user);
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  let user = { email, password };
  const userExist = USERS.find((u) => u.email === user.email);
  if (!userExist)
    res.status(400).send("user with given credentials does not exist");
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (userExist.password !== password)
    res.status(401).send("Password does not match");
  const result = { ...userExist, token: new Date().toISOString() };

  res.status(200).send(result);
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  const questions = QUESTIONS;
  res.status(200).send(questions);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).send(SUBMISSIONS);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { userId, questionId, code, status } = req.body;
  const user = USERS.find((u) => u.id === userId);
  if (!user || !userId) return res.status(400).send("userid not found");
  const submission = { userId: user.id, questionId, code, status };

  // Store the submission in the SUBMISSION array above
  SUBMISSIONS.push(submission);
  res.status(201).send(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/submissions-admin", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { userId, questionId, code, status } = req.body;
  const user = USERS.find((u) => u.id === userId);
  if (user.role !== "admin") return res.status(401).send("Not Authorized");
  if (!user || !userId) return res.status(400).send("userid not found");

  const submission = { userId: user.id, questionId, code, status };

  // Store the submission in the SUBMISSION array above
  SUBMISSIONS.push(submission);
  res.status(201).send(submission);
});
app.listen(port, function () {
  console.log(`app listening on port ${port}`);
});
