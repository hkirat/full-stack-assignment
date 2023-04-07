const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());

const USERS = [];
const LoggedInUser = {};

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
const PROBLEMS = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password, role } = req.body;
  const user = { email: email, password: password, role: role };

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).send("User with that email already exists");
  }
  USERS.push(user);
  // return back 200 status code to the client
  res.status(200).send("Sign-up successful!");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(400).send("User with that email doesn't exists");
  }
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if (user.password === password) {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    LoggedInUser["email"] = user.email;
    LoggedInUser["role"] = user.role;

    return res.status(200).send({ token: token });
  }
  // If the password is not the same, return back 401 status code to the client

  return res.status(401).send("Invalid email or password");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send({ submissions: SUBMISSION });
});

app.post("/submissions", function (req, res) {
  const { problem, solution } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Create a submission object and add it to the SUBMISSIONS array
  const submission = {
    problem: problem,
    solution: solution,
    isAccepted: isAccepted,
  };
  SUBMISSION.push(submission);

  // Send back a response with the result
  if (isAccepted) {
    res.status(200).send("Solution accepted!");
  } else {
    res.status(400).send("Solution rejected!");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/add-problem", function (req, res) {
  if (LoggedInUser["role"] === "admin") {
    const { title, description, testCases } = req.body;
    QUESTIONS.push({ title, description, testCases });

    return res.status(200).send("problem added!");
  } else {
    return res.status(401).send("Unauthorized!");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
