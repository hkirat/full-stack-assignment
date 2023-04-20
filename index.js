const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = 3000;

const USERS = [];
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
  },
];

const SUBMISSION = [
  {
    userId: 1,
    questionId: 1,
    code: "function maxArray() {return Math.max(...arr)}",
    status: "accepted",
  },
  {
    userId: 2,
    questionId: 1,
    code: "function maxArray() {return Math.min(...arr)}",
    status: "rejected",
  },
];

app.post("/signup", (req, res) => {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    res.status(400).json({ message: "Missing required fields" });
  } else {
    // return 401 if user already exist
    if (USERS.find((ele) => ele?.email === email)) {
      res.status(401);
      res.send("User already exist");
    } else {
      // store email and password (as is for now) in the USERS array (only if the user with the given email does not exist)
      USERS.push({
        email,
        password,
      });

      // return back 200 status code
      res.status(200);
      res.send("User created successfully!");
    }
  }
});

app.post("/login", (req, res) => {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    res.status(400).json({ message: "Missing required fields" });
  }

  // check if user with the given email exist in the USERS array
  // also ensure password is the same
  const matchingIndex = USERS.findIndex((ele) => ele?.email === email);
  if (USERS[matchingIndex].password === password) {
    // If the password is same return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    res.status(200);
    res.send({
      token: Math.random() * 100 + password,
    });
  } else {
    // If the password is not same return back 401 status code to the client
    res.status(401);
    res.send("Unauthorized");
  }
});

app.get("/questions", (req, res) => {
  // return all the question from the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submission/:userId/:questionId", (req, res) => {
  // return the user submission for the problem
  const { userId, questionId } = req.params;
  const matchingIndex = SUBMISSION.findIndex(
    (ele) => ele.userId === userId && ele.questionId === questionId
  );
  if (matchingIndex >= 0) {
    res.status(200);
    res.send(SUBMISSION[matchingIndex]);
  } else {
    res.status(404);
    res.send("Resource does not exist");
  }
});

app.post("/submission/:userId/:questionId", (req, res) => {
  // let the user submit a problem, randomly accept or reject the solution
  const { ans } = req.body;
  const { userId, questionId } = req.params;
  if (!ans) {
    res.status(400).json({ message: "Please write solution" });
  }

  const localAns = {
    userId,
    questionId,
    code: ans,
    status: Math.floor(Math.random() * 10) % 2 === 0 ? "accepted" : "rejected",
  };

  // store the submission in the submission array
  SUBMISSION.push(localAns);
  res.status(200);
  res.send("Submission saved successfully");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
