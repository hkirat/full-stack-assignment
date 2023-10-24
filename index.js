const express = require("express");
const crypto = require("crypto");

const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let User_Token = "";
let isLoggedin = false;

const USERS = [
  {
    username: "ram@gmail.com",
    password: "1234",
    isAdmin: false,
  },
  {
    username: "rahul@gmail.com",
    password: "1234",
    isAdmin: true,
  },
];

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

app.get("/", (req, res) => {
  res.send("Leetcode");
});

app.post("/signup", (req, res) => {
  // Add logic to decode body
  // body should have email and password

  const { username, password } = req.body;
  isAdmin = req.body.isAdmin;
  const found = USERS.find((i) => i.username === username);

  if (found) {
    res.status(409).send("email already exist."); //#409Conflict
  } else {
    isAdmin = isAdmin ? isAdmin : false;
    USERS.push({ username, password, isAdmin });
    console.log(USERS);
    res.status(200).send("You have register sucessfully");
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
});

function generate_token(length) {
  User_Token = crypto.randomBytes(length).toString("hex");
  return User_Token;
}

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  found = USERS.find(
    (i) => i.email === email && i.password === password && i.isAdmin === true
  );

  if (found) {
    if (found)
      res.status(200).send({
        messages: "You have Logged - in sucessfully",
        Admin_Token: generate_token(20),
      });
    else
      res.status(200).send({
        messages: "You have Logged - in sucessfully",
        User_Token: generate_token(20),
      });

    isLoggedin = true;
  } else {
    res.status(401).send("Please Register First.....");
  }

  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});

app.get("/problems", (req, res) => {
  //return the user all the questions in the QUESTIONS array

  res.status(200).send({ success: true, questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const userSubmission = req.body;
  console.log(userSubmission);
  const isAccepted = Math.random() < 0.5;
  SUBMISSION.push({
    ...userSubmission,
    isAccepted: isAccepted,
  });

  res.status(201).send({ accepted: isAccepted });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// Ensure that only admins can do that.
app.post("/addQuestion", (req, res) => {
  const { username, title, description, testCases } = req.body;
  const admin = USERS.find(
    (user) => user.username === username && user.isAdmin === true
  );

  if (admin) {
    QUESTIONS.push({ title, description, testCases });
    res.status(201).send({ success: true, questions: QUESTIONS });
  } else {
    res.status(409).send("Not Authorized");
  }
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
