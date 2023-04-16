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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  // console.log(req.body);
  // console.log(typeof req.body.email);

  const { email, password } = req.body;
  // USERS.push({req.body.})
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find((user) => user.email === email);
  if (userExists) {
    res.status(400).send("User already xxists! try with other email or login");
  } else {
    USERS.push({ email, password });
    res.status(200).send("Signup successful!!");
  }
  // return back 200 status code to the client
  // res.send("Hello World!");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  console.log(req.body.email);
  const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // const userExist = USERS.find((user) => user.email === req.body.email);
  const userExists = USERS.find((user) => user.email === email);
  if (!userExists) {
    res
      .status(400)
      .send("No such user found !! try signup or enter correct id.");
  } else {
    if (userExists.password === password) {
      res.status(200).json({ token: Date.now().toString() });
    } else {
      res.status(401).send("Incorrect password");
    }
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  // res.send("Hello World from route 2!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json({ question: QUESTIONS });
  // res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.json({ submissions: SUBMISSION });
  // res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { solution } = req.body;
  const accepted = Math.random() >= 0.5;
  const submission = { solution, accepted };
  SUBMISSION.push(submission);
  res.json({ submission });
  // res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/problems", function (req, res) {
  const { isAdmin } = req.body;
  if (!isAdmin) {
    res.status(401).send("Only admins can add problems");
  } else {
    const { title, description, testCases } = req.body;
    const problem = { title, description, testCases };
    QUESTIONS.push(problem);
    res.status(200).send("Problem added successfully");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
