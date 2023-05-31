const express = require("express");
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    title: "Running Sum of an Array",
    description: "Given an array, return the sum of each element",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    title: "Check Palindrome",
    description: "",
    testCases: [
      {
        input: "Kartikey",
        output: "5",
      },
    ],
  },
  {
    title: "Knapsack",
    description: "",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSIONS = [];

app.use(express.json());

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email already exists
  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser) {
    res.status(409).send("User already exists");
  } else {
    // Create a new user object and add it to the USERS array
    const newUser = { email, password };
    USERS.push(newUser);

    res.status(200).send("Signup successful");
  }
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);

  if (user && user.password === password) {
    // Return 200 status code and a token
    const token = generateToken(); // Function to generate a random token
    res.status(200).json({ token });
  } else {
    // Return 401 status code for unauthorized access
    res.status(401).send("Invalid email or password");
  }
});

app.get("/questions", function (req, res) {
  // Return all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // Return the user's submissions for this problem
  res.json(SUBMISSIONS);
});

app.post("/submissions", function (req, res) {
  // Let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSIONS array above
  const { solution } = req.body;
  const randomAcceptance = Math.random() < 0.5; // Randomly accept or reject the solution

  const submission = {
    solution,
    accepted: randomAcceptance,
  };

  SUBMISSIONS.push(submission);

  res.status(200).send("Submission successful");
});

// Leaving as hard todos
// Create a route that lets an admin add a new problem
// Ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
