const express = require("express");
const { verifyToken } = require("./authorization");
import jwt from "jsonwebtoken";
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    id: "1",
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
let id = 0;
function extractToken() {
  let token = req.header("Authorization");

  if (token.startsWith("Bearer ")) {
    token = token.substring(7, token.length);
  }
  return token;
}

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  //check if email already exists in user array

  const userExists = USERS.find((user) => user.email === email);

  //If email already exists send error response
  if (userExists) {
    return res.status(409).json({ error: "Email already exists" });
  }
  id++;
  const isAdmin=Math.random()<0.5?true:false
  //If email doesnt exist  add new user to user array
  const newUser = {id, email, password,isAdmin };
  USERS.push(newUser);
  //send success response
  res.status(201).json({ message: "User created successfully" });
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array

  const user = USERS.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Also ensure that the password is the same
  // Check if password is correct
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
 const id=user.id
const roles=user.isAdmin
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)

  // If email and password are correct, create and send JWT token
  const token = jwt.sign({ id ,roles}, "secret");
  res.status(200).json({ token });

  // If the password is not the same, return back 401 status code to the client
});

app.get("/questions",verifyToken, function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({
    questions: QUESTIONS,
  });
});

app.get("/questions/:id",verifyToken, function (req, res) {
  const id = req.params.id;
  const problem = QUESTIONS.find((question) => question.id === id);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.status(200).json({ problem });
});

app.get("/questions/submissions/:id",verifyToken, function (req, res) {
  // return the users submissions for this problem
  const id = req.params.id;
  const { code } = req.body;
  const problem = QUESTIONS.find((question) => question.id === id);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  ///
  const token = extractToken();
  const decodedToken = jwt.verify(token, "secretKey");
  const userid = decodedToken.id;

  const submission = {
    userId: userid,
    problemId: id,
    code,
    status: Math.random() < 0.5 ? "Accepted" : "Rejected",
  };
  SUBMISSION.push(submission);
  res.status(201).json({ submission });
});

app.post("/question/:id/submissions",verifyToken, function (req, res) {
  const id = req.params.id;
  const token = extractToken();
  const decodedToken = jwt.verify(token, "secretKey");
  const userId = decodedToken.id;
  const problem = QUESTIONS.find((question) => question.id === id);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }

  const userSubmissions = SUBMISSION.filter(
    (submission) => submission.userId === userId && submission.problemId === id
  );

  if (!userSubmissions) {
    return res.status(404).json({ error: "Submission not found" });
  }
  res.status(200).json({ submissions: userSubmissions });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/create-problems",verifyToken,isAdminRoute, (req, res) => {
  const {id, title, description,testCases,input,output } = res.body;
 if (!title || !description || !testCases) {
      return res.status(400).json({ error: 'Missing required fields' });
  }
  
const problem = {
  id,
  title,
  description,
  testCases: [
    {
      input,
      output
    }
  ]
  }
  
  QUESTIONS.push(problem);
});
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
