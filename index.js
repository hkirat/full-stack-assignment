const express = require('express')
const app = express()
const port = 3000

const USERS = [
  { userId: 1, email: "email1@gmail.com", password: "password1" },
  { userId: 2, email: "email2@gmail.com", password: "password2" },
];

const QUESTIONS = [
  {
    id: 'find-max',
    title: "find max",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]", output: "5"
    }]
  },
  {
    id: 'find-min',
    title: "find min",
    description: "Given an array , return the minimum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "1"
    }]
  }
];

const SUBMISSION = [
  { userId: "1", questionId: "find-max", code: "def find_max(arr): return max(arr)", status: "Accepted" },
  { userId: "1", questionId: "find-min", code: "def find_min(arr): return min(arr)", status: "Accepted" },
  { userId: "2", questionId: "find-max", code: "def find_max(arr): return min(arr)", status: "Rejected" },
]


const isAdmin = (req, res, next) => {
  const isAdminUser = req.headers.authorization === "admin";
  if (isAdminUser) {
    next();
  } else {
    res.status(403).send("You do not have permission to perform this action.");
  }
}

app.use(express.json());

app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    res.status(400).send("User with the given email already exists");
  } else {
    USERS.push({ email, password });
    res.status(200).send("User signed up successfully!");
  }
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find(user => user.email === email);
  if (!user) {
    res.status(401).send("Invalid email or password");
  } else if (user.password !== password) {
    res.status(401).send("Invalid email or password");
  } else {
    const token = "random-token";
    res.status(200).json({ token });
  }
})

app.get('/questions', (req, res) => {
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", (req, res) => {
  res.status(200).json(SUBMISSION);
});

app.post("/submissions", (req, res) => {
  const submission = req.body;

  const isAccepted = Math.random() >= 0.5;
  submission.status = isAccepted ? "Accepted" : "Rejected";

  SUBMISSION.push(submission);

  res.status(200).json(SUBMISSION);
});

app.post("/questions", isAdmin, (req, res) => {
  const question = req.body;
  QUESTIONS.push(question);
  res.status(200).send("Question added successfully!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})