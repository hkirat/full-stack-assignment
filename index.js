import express from "express";
import bodyParser from "body-parser"; // Added body-parser import

const app = express();
const PORT = 3001;
const USERS = []; // to store the user info
const ADMIN = [];

// array to store all the questions
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

// array to store submissions from the user
const SUBMISSION = [];

// middleware to decode the body
app.use(bodyParser.json()); // Added body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // Added body-parser middleware

// logic for signup
app.post("/signup", (req, res) => {
  var alreadyExists = false;
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === req.body.email) {
      alreadyExists = true;
      break;
    }
  }
  if (alreadyExists) {
    res.status(400).send("You already exist");
  } else {
    var data = { email: req.body.email, password: req.body.password };
    USERS.push(data);
    res.status(200).send("You have been successfully signed up"); // Send a response with a success message
  }
});

// logic for login
app.post("/login", (req, res) => {
  let userExists = false;
  let givenPassword = false;
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === req.body.email) {
      userExists = true;
      if (USERS[i].password === req.body.password) {
        givenPassword = true;
      }
      break;
    }
  }
  if (userExists && givenPassword) {
    res.status(200).send("Welcome to LeetCode"); // Send a response with a success message
  } else {
    res.status(401).send("Unauthorized"); // Send a response with an unauthorized message
  }
});

// return the user all the questions in the QUESTIONS array
app.get("/questions", (req, res) => {
  res.status(200).send(QUESTIONS); // Send a response with the QUESTIONS array
});

// return the users submissions for this problem
app.get("/submissions", (req, res) => {
  res.status(200).send(SUBMISSION); // Send a response with the SUBMISSION array
});

// let admin add a new question
app.post("/addQuestion", (req, res) => {
  // in the body of the request, an email, a password, and a question as an object is expected
  // logic to check if the user exists in the ADMIN array
  let adminExists = false;
  let givenPassword = false;
  for (let i = 0; i < ADMIN.length; i++) {
    if (ADMIN[i].email === req.body.email) {
      adminExists = true;
      if (ADMIN[i].password === req.body.password) {
        givenPassword = true;
      }
      break;
    }
  }
  if (adminExists && givenPassword) {
    QUESTIONS.push(req.body.question);
    res.status(200).send("Question has been added"); // Send a response with a success message
  } else {
    res.status(401).send("Unauthorized"); // Send a response with an unauthorized message
  }
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});

//comments are generated using chatGPT
