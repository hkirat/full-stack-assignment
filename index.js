const express = require('express')
const app = express()
const port = 3000
const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const authenticateUser = require("./middleware/auth.js");

app.use(express.json());
const USERS = [];
const ADMIN = [];
const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = [

]

app.post('/signup', function (req, res) {
  const { email, password } = req.body;
  if (USERS.find((user) => user.email === email)) {
    res.status(409).json({ "message": "User already exists" });
  }
  else {
    USERS.push({ email, password });
    const token = jwt.sign({ email, password }, SECRET_KEY);
    res.status(200).json({ "message": "User created succesfully", "authorization": "Bearer " + token });
  }
})

app.post('/login', function (req, res) {
  const { email, password } = req.body;
  const index = USERS.findIndex((user) => user.email == email);
  if (index != -1) {
    if (USERS[index].password == password) {
      const token = jwt.sign({ email, password }, SECRET_KEY);
      res.status(200).json({ "authorization": "Bearer " + token });
    }
    else {
      res.status(401);
    }
  }
  else {
    res.status(404).json({ "message": "User not found" });
  }
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/admin/signup', function (req, res) {
  const { email, password } = req.body;
  if (ADMIN.find((admin) => admin.email === email)) {
    res.status(409).json({ "message": "Admin already exists" });
  }
  else {
    ADMIN.push({ email, password });
    const token = jwt.sign({ email, password }, SECRET_KEY);
    res.status(200).json({ "message": "Admin created succesfully", "authorization": "Bearer " + token });
  }
})

app.post('/admin/login', function (req, res) {
  const { email, password } = req.body;
  const index = ADMIN.findIndex((admin) => admin.email == email);
  if (index != -1) {
    if (ADMIN[index].password == password) {
      const token = jwt.sign({ email, password }, SECRET_KEY);
      res.status(200).json({ "authorization": "Bearer " + token });
    }
    else {
      res.status(401);
    }
  }
  else {
    res.status(404).json({ "message": "Admin not found" });
  }
})

app.use(authenticateUser);
app.get('/questions', authenticateUser, function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions/:problemId", authenticateUser, function (req, res) {
  const { email } = req.user;
  const problemId = req.params.problemId;

  const userSubmission = SUBMISSION.find(
    (submission) => submission.user === email && submission.problem === problemId
  );

  if (userSubmission) {
    res.status(200).json(userSubmission);
  } else {
    res.status(404).json({ message: "Submission not found for this problem." });
  }
});



app.post("/submissions/:problemId", authenticateUser, function (req, res) {
  const { email } = req.user;
  const problemId = req.params.problemId;
  const pBody = req.body;

  const existingSubmission = SUBMISSION.find(
    (submission) => submission.user === email && submission.problem === problemId
  );

  if (existingSubmission) {
    existingSubmission.pBody.push(pBody);
    res.status(200).json({ "message": "Problem Updated Successfully" });
  } else {
    const problem = {
      "user": email,
      "problem": problemId,
      pBody: [pBody]
    };
    SUBMISSION.push(problem);
    res.status(201).json({ "message": "Problem Created Successfully" });
  }
});



app.post('/admin/problem', authenticateUser, function (req, res) {
  const problem = req.body;
  if (!problem) {
    res.status(404).json({ "message": "Admin not sending any problem" });
  }
  QUESTIONS.push(problem);
  res.send("Pushed Succesfully.");
})

app.get('/admin/problem', authenticateUser, function (req, res) {
  res.status(200).json(QUESTIONS);
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})