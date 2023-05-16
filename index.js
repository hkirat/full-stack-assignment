const express = require("express");
const app = express();
const port = 3001;
//To be able to understand json
app.use(express.json());
// Adding a ADMIN TOKEN to identify admin
function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const ADMIN_TOKEN = "OPEN_SOURCE_SEEMS_FUN";
const USERS = [];

const QUESTIONS = [
  {
    problemId: 1, //Added problemId to identify problems uniquely
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

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  const userExists = USERS.some((user) => user.email === email);
  if (userExists) {
    // If the user with the given email exists, return back 400 status code to the client
    return res.status(400).send("User already exists");
  } else {
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    // return back 200 status code to the client
    USERS.push({ email, password });
    return res.status(200).send("User created successfully");
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  // Also ensure that the password is the same
  if (user && user.password === password) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = Math.random().toString(36).substr(2);
    res.status(200).send({ token });
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.sendStatus(401);
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { email, problemId } = req.body;
  const userSubmissions = SUBMISSION.filter(
    (submittion) =>
      submission.email === email && submission.problemId === problemId
  );
  res.send(userSubmissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { email, problemId, solution } = req.body;
  const isAccepted = Math.random() >= 0.5;
  // Store the submission in the SUBMISSION array above
  const submission = { email, problemId, solution, isAccepted };
  SUBMISSION.push(submission);
  res.send(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/admin/problems", (req, res) => {
  const { token, title, description, testCases } = req.body;
  if (token === ADMIN_TOKEN) {
    const problemId = generateRandomId(10);
    let question = { problemId, title, description, testCases };
    QUESTIONS.push(question);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
