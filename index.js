const express = require("express");
const app = express();
const port = 3000;

const USERS = [{ email: "john@example.com", password: "password123" }];

const QUESTIONS = [
  {
    id: 1,
    title: "Maximum Element",
    description: "Given an array, return the maximum element of that array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSIONS = [];

// middleware to parse incoming JSON data
app.use(express.json());


app.post("/signup", function (req, res) {
  // decode the request body
  const { email, password } = req.body;

    // check if the email and password were included in the request body
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

     // check if a user with the given email already exists in the USERS array
  const userExists = USERS.some((user) => user.email === email);
  if (userExists) {
    return res.status(409).send("User already exists");
  }
  // add the new user to the USERS array
  USERS.push({ email, password });

  // send a response back to the client with a 200 status code
  res.status(200).send("User created successfully");
});

app.post("/login", function (req, res) {
  // decode the request body
  const { email, password } = req.body;
  // check if the email and password were included in the request body
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  // check if a user with the given email and password exists in the USERS array
  const user = USERS.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  // generate a random token for the user
  const token = Math.random().toString(36).substring(2);

  // send a response back to the client with a 200 status code and the token
  res.status(200).json({ token });
});

// GET request to fetch all questions
app.get("/questions", function (req, res) {
  res.status(200).json(QUESTIONS);
});

// GET request to fetch a specific question by ID
app.get("/questions/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const question = QUESTIONS.find((q) => q.id === id);

  if (!question) {
    return res.status(404).send("Question not found");
  }
  res.status(200).json(question);
});

// POST request to add a new submission
app.post("/submissions", function (req, res) {
  const { problemId, userId, code } = req.body;

  if (!problemId || !userId || !code) {
    return res.status(400).send("Problem ID, user ID, and code are required");
  }

  const newSubmission = { id: SUBMISSIONS.length + 1, problemId, userId, code };
  SUBMISSIONS.push(newSubmission);
  res.status(201).json(newSubmission);
});

// Create an array of admin user IDs
const ADMIN_USERS = [1, 2, 3];

// POST request to add a new problem
app.post("/problems", function (req, res) {
  const { title, description, testCases } = req.body;

  // Check if the user making the request is an admin
  const userId = req.headers["user-id"];
  if (!ADMIN_USERS.includes(parseInt(userId))) {
    return res.status(401).send("Only admins can add new problems");
  }

  // Check that all required fields are present in the request body
  if (!title || !description || !testCases) {
    return res
      .status(400)
      .send("Title, description, and test cases are required");
  }

  // Create a new problem object and add it to the PROBLEMS array
  const newProblem = { id: PROBLEMS.length + 1, title, description, testCases };

  PROBLEMS.push(newProblem);

  res.status(201).json(newProblem);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
