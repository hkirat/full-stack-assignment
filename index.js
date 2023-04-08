const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

const USERS = [];
const QUESTIONS = [];
const SUBMISSIONS = [];

app.post("/signup", function (req, res) {
  const { email, password, isAdmin } = req.body;
  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).send({ message: `Account already exists` });
  } else {
    const token = uuidv4();
    USERS.push({ email, password, isAdmin, token });
    return res
      .status(200)
      .send({ message: "Account created successfully", token });
  }
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  const existingUser = USERS.find((user) => user.email === email);

  if (!existingUser || existingUser.password !== password) {
    return res.status(401).send("Invalid email or password");
  } else {
    const token = uuidv4();
    existingUser.token = token;
    return res.status(200).json({ message: "Login successful", token });
  }
});

/*Get all the questions*/
app.get("/questions", function (req, res) {
  try {
    res.status(200).json(QUESTIONS);
  } catch {
    res.status(500).json({ message: `Internal Server Error` });
  }
});

/*Get the question with question ID*/
app.get("/questions/:qid", function (req, res) {
  const qid = req.params.qid;
  const question = QUESTIONS.find((question) => question.id === qid);

  if (!question) {
    return res.status(404).send("Question not found");
  } else {
    res.status(200).json(question);
  }
});

/*Get all the submissions for the given question ID*/
app.get("/questions/:qid/submissions/", function (req, res) {
  const submissions = SUBMISSIONS.filter(
    (submission) => submission.questionId === req.params.qid
  );
  if (!submissions) {
    return res.status(404).send("Submissions not found");
  } else {
    res.status(200).json(submissions);
  }
});

/* Post request to submit solution */
app.post("/submissions", function (req, res) {
  try {
    const newSubmission = {
      questionId: req.body.qid,
      solution: req.body.solution,
      isAccepted: Math.random() >= 0.5,
    };
    SUBMISSIONS.push(newSubmission);
    res.status(200).json({ message: `Solution submitted successfully` });
  } catch {
    res.status(500).send({ message: `Internal Server Error` });
  }
});

/* Adding new Question/Problem as an Admin */

app.post("/questions", function (req, res) {
  const token = req.headers.authorization;

  const user = USERS.find((user) => {
    return user.token === token;
  });
  if (!user || !user.isAdmin) {
    return res.status(401).send("Unauthorized Access");
  }

  if (!req.body.title || !req.body.description || !req.body.testCases)
    return res.status(400).send({
      status: false,
      message: "Title, Description and Test Cases are mandatory",
    });
  const question = {
    id: Math.random().toString(36).substring(2),
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases,
  };

  QUESTIONS.push(question);
  return res.status(200).send({ message: "Question added successfully" });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
