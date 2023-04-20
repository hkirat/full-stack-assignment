const express = require('express')
const app = express()
const port = 3001
const bodyParser = require("body-parser");
const { isBlank, generateToken } = require('./utils');

const fs = require("fs");
let usersJson = fs.readFileSync("users.json", "utf-8");
let USERS = JSON.parse(usersJson);

let questionsJson = fs.readFileSync("questions.json", "utf-8");
const QUESTIONS = JSON.parse(questionsJson);

let submissionsJson = fs.readFileSync("submissions.json", "utf-8");
const SUBMISSION = JSON.parse(submissionsJson);

var jsonParser = bodyParser.json();
app.use(jsonParser);

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  let { email, password, admin } = req.body;

  if (isBlank(email) || isBlank(password)) {
    res.status(401).send('Invalid Input');
  }

  //Store email and password (as is for now) in the USERS array above 
  //(only if the user with the given email doesnt exist)
  const userIndex = USERS.findIndex(user => user.email === email);

  if (userIndex < 0) {
    const user = {
      userId: Date.now(),
      email,
      password,
      admin: admin == true
    };

    USERS.push(user);
    usersJson = JSON.stringify(USERS);
    fs.writeFileSync("users.json", usersJson, "utf-8");

    // return back 200 status code to the client
    res.status(200).send(`User ${email} signup successful!`);
  }
  else {
    res.status(401).send('User EXISTS!');
  }
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userIndex = USERS.findIndex(user => user.email === email);

  if (userIndex < 0) {
    return res.status(401).send(`User doesn't exists! Sign Up`);
  }
  else if (USERS[userIndex].password !== password) {
    return res.status(401).send(`Invalid Password!`);
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.status(200).send({
    message: '`User Login Successful!`',
    access_token: generateToken(email, password)
  });
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
})

app.get("/submissions/:userId/:questionId", function (req, res) {
  // return the users submissions for this problem
  const { userId, questionId } = req.params;
  const allSubmissions = SUBMISSION.filter(submission =>
    submission.userId == userId && submission.questionId === questionId).reduce
    ((result, submission) => {
      result.push({
        code: submission.code,
        status: submission.status,
        language: submission.language
      })
      return result;
    }, []);

  if (allSubmissions) {
    return res.status(200).send(allSubmissions);
  }
  res.status(404).send(`No Submission found for ${questionId} submitted by ${userId}`);
});

app.post("/submissions/:userId/:questionId", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { userId, questionId } = req.params;
  const userIndex = USERS.findIndex(user => user.userId == userId);
  const questionIndex = QUESTIONS.findIndex(question => question.id == questionId);

  if (userIndex < 0 || questionIndex < 0) {
    return res.status(401).send('Invalid user or question');
  }

  const { code, language } = req.body;
  let status = "rejected";
  if (Math.random() * 100 > 50) status = "accepted";
  const submission = {
    "submissionId": Date.now(),
    "userId": userId,
    "questionId": questionId,
    "code": code,
    "language": language,
    "status": status
  };

  SUBMISSION.push(submission);
  submissionsJson = JSON.stringify(SUBMISSION);
  fs.writeFileSync("submissions.json", submissionsJson, "utf-8");

  res.status(200).send(`Submission ${status}!`);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const authorizeUser = (req, res, next) => {
  const { userId } = req.query;
  const userIndex = USERS.findIndex(user => (userId == user.userId));
  if (userIndex < 0 || !USERS[userIndex].admin) {
    res.status(401).send('User Not Authorized!!');
  }
  else {
    next();
  }
};

app.post("/questions", authorizeUser, (req, res) => {
  const { title, description, testCases } = req.body;
  const question = {
    id: Date.now(),
    title,
    description,
    testCases
  };
  QUESTIONS.push(question);
  questionsJson = JSON.stringify(QUESTIONS);
  fs.writeFileSync("questions.json", questionsJson, "utf-8");

  res.status(200).send('Question added successfully');
});

app.listen(port, function () {
  console.log(`Hey There Listening to the ${port}...`)
})