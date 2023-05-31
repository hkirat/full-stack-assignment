const express = require("express");
const bodyParser = require("body-parser");
const QUESTIONS = require("./questions");
const { restart } = require("nodemon");

const app = express();

const port = 5000;

app.use(bodyParser.json());
const USERS = [];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and Password are required" });

  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser)
    return res.status(409).json({ error: "User already exists" });

  USERS.push({ email, password });
  res.status(201).json({ message: "User created successfully" });
});

app.post("/login", function (req, res) {
  // return
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const { email, password, role } = req.body;
  if (!email || !password || role)
    return res
      .status(400)
      .json({ error: "Role,Email and Password are required" });

  const user = USERS.find((user) => user.email === email);

  if (!user || user.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });

  res.status(200).json({
    token: "alfkjsdioiewafds12342r980",
    message: "User login successful",
  });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array

  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(req.body);
  res.status(200).json(SUBMISSION);
});

app.post("/add-problem", function (req, res) {
  // leaving as hard todos
  // Create a route that lets an admin add a new problem
  // ensure that only admins can do that.
  const { role, problem } = req.body;
  if (!role) res.status(401).json({ error: "role is required" });
  const isAdmin = role === "admin";
  if (isAdmin) {
    const { title, description, testCases } = problem;
    if (!title || !description || !testCases)
      return res.status(401).send({ error: "missing keys in problem" });
    QUESTIONS.push(problem);
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
