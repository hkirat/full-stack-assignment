const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());
const USERS = [
  {
    email: "niraj@niraj.com",
    password: "niraj",
    isAdmin: true,
  },
];

const authToken = "randomToken";
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
    id: 3,
    title: "Two states",
    description: "Given an array , return the sum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "15",
      },
    ],
  },
];

const SUBMISSION = [];

const isAdmin = (req, res, next) => {
  const { email } = req.body;
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send("Unauthorized");
  } else {
    const user = USERS.find((user) => user.email == email);
    if (user.isAdmin) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  }
};

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  }
  const usedEmail = USERS.find((user) => user.email === email);
  if (usedEmail) {
    res.status(400).send("Email already exists");
  }
  USERS.push({ email, password, isAdmin: false });
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)

  // return back 200 status code to the client
  res.status(200).send("User created successfully");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  }
  const user = USERS.find((user) => user.email == email);
  if (!user) {
    res.status(400).send("Email does not exist");
  }
  if (user.password != password) {
    res.status(400).send("Password is incorrect");
  }
  res
    .status(200)
    .json({ msg: "user successfully logged in", token: authToken });
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.json(SUBMISSION);
  res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const submission = req.body;
  const accepted = Math.random() < 0.5 ? true : false;
  SUBMISSION.push({ ...submission, accepted });
  accepted
    ? res.status(200).send("Accepted")
    : res.status(400).send("Rejected");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/questions/add", isAdmin, function (req, res) {
  const question = req.body;
  QUESTIONS.push(question);
  res.status(200).send("Question added successfully");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
