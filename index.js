const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

const SECRET_KEY = 'khan';
function userExists(email) {
  return USERS.find((user) => user.email === email);
}

app.use(express.json());

// Helper function to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.status(500).json({ message: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
}



// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Forbidden: You are not an admin" });
  }
  next();
}

// POST route for user signup
app.post("/signup", async (req, res) => {
  const { email, password, isAdmin } = req.body;

  if (userExists(email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  USERS.push({ email, password: hashedPassword, isAdmin: !!isAdmin });

  return res.status(200).json({ message: "User added successfully" });
});

// POST route for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = userExists(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.email, isAdmin: user.isAdmin },
    SECRET_KEY,
    {
      expiresIn: 86400, // expires in 24 hours
    }
  );

  return res.status(200).json({ message: "Login successful", token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { problemId } = req.query;

  // Filter submissions to find those matching the given problemId
  const problemSubmissions = SUBMISSION.filter(
    (submission) => submission.problemId == problemId
  );

  // Return the filtered submissions
  res.status(200).json({ submissions: problemSubmissions });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  // Decode body to get submission details
  const { problemId, solution } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() >= 0.5;

  // Store the submission in the SUBMISSION array
  const submission = {
    problemId,
    solution,
    isAccepted,
  };
  SUBMISSION.push(submission);

  // Return the result of the submission
  res.status(200).json({ message: "Submission received", submission });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/questions", [verifyToken, isAdmin], (req, res) => {
  const { title, description, testCases } = req.body;
  const newProblem = { title, description, testCases };
  QUESTIONS.push(newProblem);
  res
    .status(200)
    .json({ message: "Problem added successfully", problem: newProblem });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
