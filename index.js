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

// middleware to parse json data
app.use(express.json());

const SUBMISSIONS = [];

function checkAdmin(req, res, next) {
  const { isAdmin } = req.query;
  // if isAdmin is true and exist in query parameters, the user is admin and can add problem to questions array
  if (isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorizied" });
  }
}
app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //console.log(req.body)
  let email = req.body.email;
  let password = req.body.password;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let user = USERS.find((user) => user.email === email);
  if (user) res.status(400).send("User already exist");
  else {
    USERS.push({
      email: email,
      password: password,
    });
    res.status(200).send("User added successfully");
  }
  // USERS.forEach(user => {
  //   console.log(user)
  // })
  // return back 200 status code to the client
  // res.send("Hello World!");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  // console.log(req.body);
  let { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  let user = USERS.find(
    (user) => user.email === email && user.password === password
  );
  // Also ensure that the password is the same
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  res.status(200).json({ message: "Login successful", token });
  //res.send("Hello World from route 2!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions/:problemId", function (req, res) {
  // extract the problemId from the request params
  const problemId = req.params.problemId;
  // extract the email from the request body
  const { email } = req.body;
  // filter the submissions array to find matching submissions
  const matchingSubmissions = SUBMISSIONS.filter(
    (submission) =>
      submission.problemId === problemId && submission.email === email
  );

  if (!matchingSubmissions) {
    return res.status(404).json({ error: "Submission not found" });
  }
  // return the matching submission as the response
  res.status(200).json(matchingSubmissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  // extract the submissions details from the request body
  const { email, problemId, submittedData } = req.body;
  // create a submission object

  const submission = {
    email: email,
    problemId: problemId,
    submittedData: submittedData,
    isAccepted: Math.random() >= 0.75,
  };
  // add the submission object to the submission array
  SUBMISSIONS.push(submission);

  res.status(200).json(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/add-problems", checkAdmin, function (req, res) {
  const { title, description, testCases } = req.body;

  const problem = { title, description, testCases };
  QUESTIONS.push(problem);
  res.status(200).json({ message: "Problem added", problem });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
