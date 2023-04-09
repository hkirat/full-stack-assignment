const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

const SUBMISSIONS = {};
const USERS = [];
const LOGGED_IN_USERS = [];
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

/**
 * Request body format:
 *
 *    {
 *      email: "...",
 *      password: "..."
 *    }
 */
app.post("/signup", function (req, res) {
  const userDetails = req.body;
  if (
    Object.keys(userDetails).length !== 2 ||
    !(userDetails.email && userDetails.password)
  ) {
    res.status(400).send("Invalid request");
  } else if (USERS.find((user) => user.email === userDetails.email)) {
    res.status(400).send("User already exists");
  } else {
    USERS.push(userDetails);
    res.status(200).send(`User added successfully: ${userDetails.email}`);
  }
});

/**
 * Request body format:
 *
 *    {
 *      email: "...",
 *      password: "..."
 *    }
 */
app.post("/login", function (req, res) {
  const userDetails = req.body;
  if (
    Object.keys(userDetails).length !== 2 ||
    !(userDetails.email && userDetails.password)
  ) {
    res.status(400).send("Invalid request");
  } else {
    const user = USERS.find((user) => user.email === userDetails.email);

    if (user && user.password === userDetails.password) {
      const token = userDetails.email + Math.random() * 1000;
      LOGGED_IN_USERS.push({ email: user.email, token: token });
      res
        .status(200)
        .send(
          `User logged in successfully: ${userDetails.email}.\n Token: ${token}`
        );
    } else {
      res.status(401).send("Invalid email or password");
    }
  }
});

app.get("/questions", function (req, res) {
  res.status(200).json(QUESTIONS);
});

/**
 * Request body format:
 *
 *    {
 *      email: "..."
 *    }
 */
app.get("/submissions", function (req, res) {
  const user = req.body;
  if (Object.keys(user).length !== 1 || !user.email) {
    res.status(400).send("Invalid request");
  } else if (!SUBMISSIONS[user.email]) {
    res.status(400).send("Submission not found for the user");
  } else {
    res.status(200).json(SUBMISSIONS[user.email]);
  }
});

/**
 * Request body format:
 *
 *    {
 *      token: "...",     // the token received on login
 *      submission: {
 *          title: "...",
 *          solution: {}
 *      }
 *    }
 */
app.post("/submissions", function (req, res) {
  const submission = req.body;
  if (
    Object.keys(submission).length !== 2 ||
    !(submission.token && submission.submission)
  ) {
    res.status(400).send("Invalid request");
  } else {
    const user = LOGGED_IN_USERS.find(
      (user) => user.token === submission.token
    );

    if (user) {
      if (!QUESTIONS.find((q) => q.title === submission.submission.title)) {
        res.status(400).send("Question doesn't exist");
      } else {
        const random = Math.random();
        if (random > 0.5) {
          SUBMISSIONS[user.email] = submission.submission;
          console.log(SUBMISSIONS);
          res
            .status(200)
            .send(`Submission successful: ${submission.submission}.`);
        } else {
          res.status(400).send("Incorrect solution.");
        }
      }
    } else {
      res.status(401).send("SignUp / Login to submit solutions");
    }
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
