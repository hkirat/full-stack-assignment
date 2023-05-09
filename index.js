const express = require("express");
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

checkIfUserExists = (email) => {
  return USERS.some((user) => user.email === email);
}

checkPassword = (email, password) => {
  return USERS.some((user) => user.email === email && user.password === password);
}

checkAdmin = (email) => {
  return USERS.some((user) => user.email === email && user.isAdmin);
}

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password, isAdmin } = req.body;

  // body should have email and password
  if (!email || !password) {
    res.status(401).send("Email and password are required");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!checkIfUserExists(email)) {
    USERS.push({ email: email, password: password, isAdmin: isAdmin });
    res.status(200).send("User created");
  } else {
    res.status(401).send("User already exists");
  }

  // return back 200 status code to the client
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  if (!email || !password) {
    res.status(401).send("Email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (checkIfUserExists(email)) {
    if (checkPassword(email, password)) {
      const token = Math.random().toString(36).substr(2,10);
      res.send(token);
      res.status(200).send("User logged in successfully");
    } else {
      res.status(401).send("Password is incorrect");
    }
  } else {
    res.status(401).send("User does not exist");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { submission } = req.body;
  if (!submission) {
    res.status(400).send("Submission is required");
  }
  const random = Math.random();
  if (random > 0.5) {
    res.status(200).send("Accepted");
  } else {
    res.status(400).send("Rejected");
  }
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.post("/questions", function (req, res) {
  // ensure that only admins can do that.
  const { question , email } = req.body;
  if(!checkAdmin(email)) {
    res.status(401).send("Only admins can add questions");
  }
  if (!question) {
    res.status(401).send("Question is required");
  }
  QUESTIONS.push(question);
  res.status(200).send("Question added successfully");
})


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
