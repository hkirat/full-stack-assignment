const express = require("express");
const bcrypt = require("bcrypt");
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

app.post("/signup", async (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const user = USERS.find((user) => user.email === email);
  if (user) {
    res.status(400).send("User already exists");
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store email and hashed password in the USERS array
    USERS.push({ email, password: hashedPassword });

    res.sendStatus(200);
  }
});

app.post("/login", async (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    res.status(401).send("Invalid credentials");
  } else {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // Compare the password provided by user with the hashed password stored in database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      // If the password is correct, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      const token = "randomstring123";
      res.status(200).json({ token });
    } else {
      // If the password is incorrect, return back 401 status code to the client
      res.status(401).send("Invalid credentials");
    }
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { title, description, input, output } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() >= 0.5;

  // Create a new submission object
  const submission = {
    title,
    description,
    input,
    output,
    isAccepted,
  };

  // Store the submission in the SUBMISSION array
  SUBMISSION.push(submission);

  // Send back the submission object as response
  res.status(200).json(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/problems", function (req, res) {
  // Check if the request contains a valid admin token in the headers
  const token = req.headers.authorization;
  if (token !== "Bearer admin_token") {
    return res.status(401).send("Unauthorized");
  }

  // Extract problem details from the request body
  const { title, description, testCases } = req.body;

  // Create a new problem object
  const problem = {
    title,
    description,
    testCases,
  };

  // Add the problem to the QUESTIONS array
  QUESTIONS.push(problem);

  // Return a success response with the new problem object
  res.status(200).json(problem);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
