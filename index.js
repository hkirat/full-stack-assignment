const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

/**--------------------- Array definition---------------------------------------- */
const USER = [
  { userid: 1, email: "john@gmail.com", password: "password2", admin: false },
  { userid: 2, email: "jane@gmail.com", password: "password3", admin: false },
];

const QUESTION = [
  {
    problemid: 1,
    title: "addition",
    description: "Write a logic to add two number",
    testcase: [
      { input: "2 3", output: 5 },
      { input: "4 5", output: 9 },
    ],
  },

  {
    problemid: 2,
    title: "Substraction",
    description: "Write a logic to sub two number",
    testcase: [
      { input: "2 3", output: -1 },
      { input: "4 5", output: -1 },
    ],
  },
  {
    problemid: 3,
    title: "multiply",
    description: "Write a logic to multiply two number",
    testcase: [
      { input: "2 3", output: 6 },
      { input: "4 5", output: 20 },
    ],
  },
];

const SUBMISSION = [];

/*---------------------------- Verify token function --------------------------------------*/
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  console.log("Token value: " + token);
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ message: "Invalid token", error: error.message });
  }
};

/*-------------------------------------------------------------------------------------------------------*/
app.get("/", (req, res) => {
  res.send("<html><body><h1>Hell Yeah This is html</h1></body></html>");
});

//Sign Up
app.post("/signUp", (req, res) => {
  const { userid, email, password, admin } = req.body;
  const exist = USER.some(
    (USER) => USER.email == email && USER.password == password
  );

  if (!exist) {
    const token = jwt.sign({ email, admin }, JWT_SECRET_KEY);
    USER.push({ userid, email, password, admin });
    res.status(200).send({ msg: "User added to database", token });
  } else {
    res.status(401).send({ msg: "User already exist" });
  }
});

//Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const exist = USER.find(
    (USER) => USER.email == email && USER.password == password
  );

  if (exist) {
    const admin = exist.admin;
    console.log("Admin Status" + admin);
    const token = jwt.sign({ email, admin }, JWT_SECRET_KEY);
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly`);
    res.status(200).send({ msg: "User logged in", token });
  } else {
    res.status(400).send({ msg: "Given email id or password not present" });
  }
});

//logout
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send({ message: "Logout successful" });
});

//List Question--> Only loggedIn users can view questions
app.get("/questions", verifyToken, (req, res) => {
  res.send(QUESTION);
});

app.post("/submissions", verifyToken, (req, res) => {
  //Only the logged in users can submit solution, in my JWT token email id is present and is unique

  const user = USER.find((USER) => (USER.email = req.user.email));
  console.log("JWT token email" + req.user.email);
  console.log("User returned from find" + user);
  console.table(user);
  console.log("User id of user logged in" + user.userid);
  const { problemid, submission } = req.body;
  const acceptSolution = Math.random() < 0.5;
  SUBMISSION.push({ user, problemid, submission, acceptSolution });

  if (acceptSolution) {
    res.send("Solution Accepted");
  } else {
    res.send("Solution rejected");
  }
});

app.get("/submissions", (req, res) => {
  const { userid, problemid } = req.body;

  const matchingSubmission = SUBMISSION.find(
    (s) => s.userid === userid && s.problemid === problemid
  );
  if (matchingSubmission) {
    res.send(matchingSubmission);
  } else {
    res.send({ msg: "No submission found for user and problem" });
  }
});

app.post("/createproblem", verifyToken, (req, res) => {
  // Only admin can create a problem

  if (!req.user.admin) {
    console.log("Not Admin" + req.user.admin);
    return res
      .status(401)
      .send({ message: "Unauthorized - only admins can add problems" });
  }

  const { title, description, testcase } = req.body;
  const problemid = QUESTION.length + 1;
  const newProblem = { problemid, title, description, testcase };
  QUESTION.push(newProblem);
  res.send({ message: "New problem added successfully", problem: newProblem });
});

app.listen(process.env.PORT, () => {
  console.log("Server started...on ${process.env.PORT}");
});
