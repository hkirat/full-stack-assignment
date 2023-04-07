const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post("/signup", (req, res) => {
  // Added logic to decode body
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;

  // Checking if the user with the given email exists in the USERS array
  const user = USERS.filter((user) => user.email === email);
  // Checking if the user with the email already exist
  if (user.length !== 0) {
    res.status(401).json({ message: `Email already exist!` });
    return;
  }

  // Storing email and password in the array above
  // TODO: Add the email and password to the database
  // Operation will only be done when email not exist
  USERS.push({ email, password, isAdmin });

  // return back 200 status code to the client
  res.status(200).json({ message: `Sign up successful!` });
});

app.post("/login", (req, res) => {
  // Added logic to decode body
  const email = req.body.email;
  const password = req.body.password;

  // Checking if the user with the given email exists in the USERS array
  const user = USERS.filter((user) => user.email === email);
  // Checking if the user with the email exist
  if (user.length === 0) {
    res.status(401).json({ message: `No email exist!` });
    return;
  }
  // If user exist, checking if the password is same
  if (user[0].password !== password) {
    res.status(401).json({ message: `Wrong password!` });
    return;
  }

  // TODO: Send a valid token after generation
  res.status(200).json({
    message: `Login successful!`,
    token: `uc7ftqhe7tcbq8wg8bqcsygdquygsv8cqc8cb`,
  });
});

app.get("/questions", (req, res) => {
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", (req, res) => {
  // Getting the email from the body
  const email = req.query.email;

  // Getting user's submissions from submission array
  const userSubmissions = SUBMISSION.filter(
    (submission) => submission.email === email
  );

  res.status(200).json(userSubmissions);
});

app.post("/submissions", (req, res) => {
  // Getting the email from the body
  // TODO: Change email with the token string
  const email = req.body.email;
  const code = req.body.code;

  // Checking if the user with the given email exists in the USERS array
  const user = USERS.filter((user) => user.email === email);
  // Checking if the user with the email exist
  if (user.length === 0) {
    res.status(401).json({ message: `No email exist!` });
    return;
  }

  // let the user submit a problem, randomly accept or reject the solution
  // TODO: Add valid business logic to accept and reject solution
  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSION array above
  SUBMISSION.push({
    email,
    code,
    time: Date.now(),
    isAccepted,
  });

  // Sending the response
  res
    .status(200)
    .send({ message: `Submission ${isAccepted ? "successful" : "failed"}!` });
});

app.post(`/add-question`, (req, res) => {
  // Getting the email from the body
  // TODO: Change email with the token string
  const email = req.body.email;
  const question = req.body.question;

  // Getting the user from the USERS array
  const user = USERS.filter((user) => user.email === email);
  // Returning if user does not exist
  if (user.length === 0) {
    res.status(401).json({ message: `No email exist!` });
    return;
  }

  // Returning if user is not an admin
  if (!user[0].isAdmin) {
    res.status(401).json({ message: `You are not admin!` });
    return;
  }

  // Now, if user exist and is Admin, let's add him some a question
  QUESTIONS.push(question);
  res.status(200).json({ message: `Question added successfully!` });
});

app.listen(port, () => {
  console.log(
    `Example app listening http://localhost:${port} and http://127.0.0.1:${port}`
  );
});
