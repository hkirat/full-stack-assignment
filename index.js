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
  // console.log(req.body)
  if (!req.body || !req.body.email || !req.body.password) {
    // If not, return a 400 status code and an error message to the client
    return res
      .status(400)
      .send("Bad Request: email and password fields are required");
  }

  // Extract the email and password from the request body
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const userExists = USERS.some((user) => user.email === email);

  // If the user already exists, return a 409 status code and an error message to the client
  if (userExists) {
    return res
      .status(409)
      .send("Conflict: user with the given email already exists");
  }

  // If the user does not exist, store their information in the USERS array
  USERS.push({ email, password });

  // Return a 200 status code and a success message to the client
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
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION)
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
    res.status(200).json({message})
  // res.send('hi')
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
