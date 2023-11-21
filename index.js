const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware");
const port = 3000;
let USER_ID_COUNTER = 1;
const JWT_SECRET = "secret";
const USERS = [];
const SUBMISSIONS = [];
const PROBLEMS = [
  {
    problemId: "1",
    title: "401. Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%",
    description:
      "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    exampleIn: "left = 5, right = 7",
    exampleOut: "4",
  },
  {
    problemId: "2",
    title: "205. Add two numbers",
    difficulty: "Medium",
    acceptance: "41%",
    description:
      "Given two numbers, add them and return them in integer range. use MOD=1e9+7",
    exampleIn: "a = 100 , b = 200",
    exampleOut: "300",
  },
  {
    problemId: "3",
    title: "202. Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: "Write an algorithm to determine if a number n is happy.",
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "4",
    title: "203. Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%",
    description: "Given number k , removed kth element",
    exampleIn: "list: 1->2->3 , k=2",
    exampleOut: "1->3",
  },
  {
    problemId: "5",
    title: "201. Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%",
    description:
      "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    exampleIn: "left = 5, right = 7",
    exampleOut: "4",
  },
  {
    problemId: "6",
    title: "205. Add two numbers",
    difficulty: "Medium",
    acceptance: "41%",
    description:
      "Given two numbers, add them and return them in integer range. use MOD=1e9+7",
    exampleIn: "a = 100 , b = 200",
    exampleOut: "300",
  },
  {
    problemId: "7",
    title: "202. Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: "Write an algorithm to determine if a number n is happy.",
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "8",
    title: "203. Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%",
    description: "Given number k , removed kth element",
    exampleIn: "list: 1->2->3 , k=2",
    exampleOut: "1->3",
  },
];
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "hello world",
  });
});

app.post("/signup", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  } else {
    const newUser = { email, password, id: USER_ID_COUNTER++ };
    USERS.push(newUser);
    return res.status(200).json({ message: "User successfully created" });
  }
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = USERS.find((user) => user.email === email);

  if (!user) {
    return res
      .status(401)
      .json({ message: "Authentication failed. User not found." });
  } else {
    if (user.password === password) {
      const token = jwt.sign(
        {
          id: user.id,
        },
        JWT_SECRET
      );
      return res
        .status(200)
        .json({ message: "Authentication successful", token });
    } else {
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }
  }
});

app.get("/problems", function (req, res) {
  res.status(200).json(PROBLEMS);
});

app.get("/submissions", auth, function (req, res) {
  const problemId = req.query.problemId;
  const submissionsForProblem = SUBMISSIONS.filter(
    (submission) => submission.problem === problemId
  );
  res.status(200).json(submissionsForProblem);
});

app.post("/submission", auth, function (req, res) {
  const { problemId, solution } = req.body;
  const isAccepted = Math.random() < 0.5;
  const submission = {
    problemId,
    solution,
    isAccepted,
  };
  SUBMISSIONS.push(submission);
  if (isAccepted) {
    return res.status(200).json({ message: "Submission accepted", submission });
  } else {
    return res.status(400).json({ message: "Submission rejected", submission });
  }
});

app.get("/problem", (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const problem = PROBLEMS.find((x) => x.problemId === id);
  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }
  return res.status(200).json({ problem });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
