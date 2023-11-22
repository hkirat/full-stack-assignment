const express = require("express");
const verifyJWT = require("./middlewares/verifyJWT");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = require("./middlewares/verifyJWT");
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
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
];

const SUBMISSION = [];

app.post("/signup", (req, res) => {
  const { email, pwd } = req.body;

  //check if response contains email and pwd and it not empty
  if (!email || !pwd) {
    res.status(400).send("Please enter valid email or password");
    return;
  }

  //if the response contains email and pwd check if user exits or not
  if (USERS.some((user) => user.email === email)) {
    res.status(409).send("User already exits");
    return;
  } else {
    USERS.push({ email: email, password: pwd });
    res.status(200).send("User successfully added");
    return;
  }
});

app.post("/login", (req, res) => {
  const { email, pwd } = req.body;

  const isUserExist = USERS.find((user) => user.email === email);

  if (!isUserExist) {
    res.status(404).send("User not found");
    return;
  }

  if (isUserExist.password === pwd) {
    const token = jwt.sign(
      {
        userInfo: {
          email,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "20m" }
    );
    res.status(200).send({ token });
    return;
  } else {
    res.status(401).send("Incorrect password");
  }
});

app.use(verifyJWT); // this ensures below routes can only be accessed when logged in

app.get("/questions", (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required" });

  const question = QUESTIONS.find((que) => que.problemId === req.params.id);
  if (!question) {
    res
      .status(404)
      .json({ message: `Question with id: ${req.params.id} not found` });
  }
  return res.json(question);
});

app.get("/submissions", (req, res) => {
  const problemId = req.query.problemId;
  const submissionsForProblem = SUBMISSION.filter(
    (submission) => submission.problem === problemId
  );
  res.status(200).json(submissionsForProblem);
});

app.post("/submissions", (req, res) => {
  const { problemId, solution } = req.body;
  const isAccepted = Math.random() < 0.5;
  const submission = {
    problemId,
    solution,
    isAccepted,
  };
  SUBMISSION.push(submission);
  if (isAccepted) {
    return res.status(200).json({ message: "Submission accepted", submission });
  } else {
    return res.status(400).json({ message: "Submission rejected", submission });
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
