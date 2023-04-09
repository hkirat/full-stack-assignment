const express = require("express");
const app = express();
const port = 3000;

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

  {
    title: "Two states",
    description: "Given an array , return the minimum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "1",
      },
    ],
  },
];

const SUBMISSION = [];

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  const { token } = req.headers;

  if (!token || token !== "admin") {
    return res.status(401).send("Unauthorized");
  }

  next();
}

app.get('/', function(req, res) {
  res.send('Hello World!')
})

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;

  // Check if the user already exists in the USERS array
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    return res.status(409).send('User already exists');
  }

  // Store email and password in the USERS array
  USERS.push({ email, password });

  // Return a 200 status code to the client
  res.status(200).send('User created successfully');
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  if (!user) {
    // If the user doesn't exist, send a 401 Unauthorized response
    res.status(401).send('Invalid email or password');
    return;
  }

  // Verify that the password is correct
  if (user.password !== password) {
    // If the password is incorrect, send a 401 Unauthorized response
    res.status(401).send('Invalid email or password');
    return;
  }

  // If both email and password match, generate a random token
  const token = Math.random().toString(36).substring(7);

  // Store the token for later use, e.g. to authenticate other requests
  // ...

  // Send a 200 OK response with the token as the payload
  res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { problemId } = req.query;

  const submissions = SUBMISSION.filter(
    (submission) => submission.problemId === problemId
  );

  res.send(submissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { problemId } = req.body;
  const isAccepted = Math.random() >= 0.5;
  const newSubmission = {
    problemId,
    solution: req.body.solution,
    isAccepted,
  };
  SUBMISSION.push(newSubmission);
  res.status(200).send(`Solution ${isAccepted ? "accepted" : "rejected"}.`);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/problems", isAdmin, function (req, res) {
  // Add a new problem to the QUESTIONS array
  // Only admins can do that
  const { title, description, testCases } = req.body;

  if (!title || !description || !testCases) {
    return res
      .status(400)
      .send("Title, description and test cases are required");
  }

  QUESTIONS.push({ title, description, testCases });
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});