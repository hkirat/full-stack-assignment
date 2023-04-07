const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

let userCount = 0,
  questionsCount = 0,
  ADMIN_TOKEN = 9289202091;
const USERS = [
  {
    id: 0,
    email: "email@email.com",
    password: "password123",
  },
];

const QUESTIONS = [
  {
    id: 0,
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

const SUBMISSION = [
  {
    userId: 0,
    questionId: 0,
    code: "function something(){}",
    status: "accepted",
  },
];

//  Middleware to parse the body of the request
app.use(bodyParser.json());

app.post("/signup", function (req, res) {
  // logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!USERS.find((user) => user.email === email)) {
    USERS.push({ id: userCount++, email, password });
  } else {
    return res.status(400).send({ message: "Email already exists" });
  }

  if (password.trim().length <= 8) {
    return res.status(400).send({
      message:
        "Password should be greater or equal to 8 characters with no spaces",
    });
  }

  // return back 200 status code to the client
  res.send({ message: "Account created successfully!" });
});

app.post("/login", function (req, res) {
  // logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(400).send({ message: "Account doesn't exist" });
  }

  if (user["password"] != password) {
    return res.status(401).send({ message: "Invalid password" });
  }

  res.send({ token: Date.now() });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { qsnId, userId } = req.body;
  if (!qsnId || !userId) {
    return res.status(400).send({ message: "Please provide qsnId and userId" });
  }

  const submissions = SUBMISSION.filter(
    (submission) => submission.questionId == qsnId
  );

  if (submissions.length === 0) {
    return res
      .status(400)
      .send({ message: "No submissions for this questions are found" });
  }

  const userSubmission = submissions.find(
    (submission) => submission.userId == userId
  );
  if (!userSubmission) {
    return res
      .status(400)
      .send({ message: "You have no submissions for this question" });
  }

  res.json({ submission: userSubmission });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { qsnId, userId, code } = req.body;

  if (!qsnId || !userId || !code) {
    res.status(400).send({ message: "Please provide qsnId, userId and code" });
  }

  // Store the submission in the SUBMISSION array above
  const submissions = SUBMISSION.filter(
    (submission) => submission.questionId == qsnId
  );
  const userSubmission = submissions.find(
    (submission) => submission.userId == userId
  );
  if (userSubmission) {
    return res
      .status(400)
      .send({ message: "You have already submitted the solution" });
  }

  SUBMISSION.push({
    userId: userId,
    questionId: qsnId,
    code: code,
    status: Math.round(Math.random()) === 1 ? "accepted" : "rejected",
  });
  res.send({ message: "Submission added" });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/question", function (req, res) {
  const { adminToken, title, description, testCases } = req.body;

  if (!adminToken || !title || !description || !testCases) {
    return res.status(400).send({
      message:
        "Please provide fields: adminToken,title, description, testCases ",
    });
  }

  if (adminToken != ADMIN_TOKEN) {
    return res.status(401).send({
      message: "Authorization failed",
    });
  }

  QUESTIONS.push({
    id: questionsCount++,
    title,
    description,
    testCases,
  });

  res.send({ message: "Question added" });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
