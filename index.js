const express = require("express");
const app = express();
const port = 3001;

const USERS = [
  {
    email: "random@gmail.com",
    password: "random",
    isAdmin: true,
  },
];

const QUESTIONS = [
  { title: "Two states",
  description: "Given an array , return the maximum of the array?", testCases: [
    {
      input: "[1,2,3,4,5]",
      output: "5",
      },
    ],
  },
  {
    title: "Three states",
    description: "Given an array , return the minimum of the array?",
    testCases: [
        {
            input: "[1,2,3,4,5]",
            output: "1",
        },
    ],
  },
  {
    title: "Four",
    description: "Given an array , return the sum of the array?",
    testCases: [
        {
            input: "[1,2,3,4,5]",
            output: "15",
        },
    ],
  }
];

const SUBMISSION = [
    {
        questionId: "Four",
        email: "random@gmail.com",
        code: "function sum(arr) { return arr.reduce((a, b) => a + b, 0); }",
    }
];
app.use(express.json());
app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password, isAdmin } = req.body;

  if (USERS.find((user) => user.email === email)) {
    res.status(400).send("User already exists");
  } else {
    USERS.push({ email, password, isAdmin });
    res.status(200).send("User created successfully");
  }
});app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password, isAdmin } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  if (
    USERS.find((user) => user.email === email && user.password === password && user.isAdmin === isAdmin)
  ) {
    res.status(200).send("User logged in successfully");
  } else {
    res.status(401).send("Invalid credentials");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});
app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array


  app.get("/submissions/:questionId", function (req, res) {
    const { questionId } = req.params;

    // Find the question based on the questionId
    const question = QUESTIONS.find((q) => q.title === questionId);

    if (!question) {
      res.status(404).send("Question not found");
      return;
    }

    // Find submissions for the specific question
    const submissions = SUBMISSION.filter((submission) => submission.questionId === questionId);

    res.json(submissions);
  });

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { questionId, email, code } = req.body;
  if(USERS.find((user) => user.email === email)){
    SUBMISSION.push({ questionId, email, code });
    if(Math.random() < 0.5) 
      res.send("Correct Submission");
    else
      res.send("Incorrect Submission");
    res.status(200).send("Submission created successfully");
  }else
    res.status(401).send("Invalid credentials");
    // return back 200 status code to the client
});
// leaving as hard todos
app.post("/questions", function (req, res) {
  // Create a route that lets an admin add a new problem
  // ensure that only admins can do that.
  const { email, title, description, testCases } = req.body;

  //find user with email
  const user = USERS.find((user) => user.email === email);
  if(!user || user.isAdmin !== true){
    res.status(401).send("Access Denied");
    return;
  }

  QUESTIONS.push({ title, description, testCases });
  res.status(200).send("Question created successfully");});

  app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
  });
