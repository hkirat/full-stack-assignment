const express = require("express");
const app = express();
app.use(express.json())
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    _id: "1",
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    _id: "2",
    title: "FizzBuzz",
    description:
      "Write a program that prints the numbers from 1 to 100. But for multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.",
    testCases: [
      {
        input: "1",
        output: "1",
      },
      {
        input: "3",
        output: "Fizz",
      },
      {
        input: "5",
        output: "Buzz",
      },
      {
        input: "15",
        output: "FizzBuzz",
      },
      {
        input: "100",
        output: "Buzz",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let userExists = false;
  for (let user of USERS) {
    if (user.email === email) {
      userExists = true;
    }
  }
  if (!userExists) {
    USERS.push({ email, password });
  }
  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let userExists = false;
  for (let user of USERS) {
    if (user.email === email && user.password === password) {
      userExists = true;
    }
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (!!userExists) {
    res.status(200).send("ABCDEF");
  } else {
    res.sendStatus(401);
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { userId, questionId } = req.query;
  const submissions = [];
  for (let submission of SUBMISSION) {
    if (submission.userId.toString() === userId && submission.questionId.toString() === questionId) {
      submissions.push(submission);
    }
  }

  res.status(200).send(submissions);
});

function generateStatus() {
  const random = Math.floor(Math.random() * 2);
  if (random % 2 === 0) {
    return "rejected";
  }
  return "accepted";
}

app.post("/submissions", function (req, res) {
  const { questionId, userId, code } = req.body;
  SUBMISSION.push({
    questionId: questionId,
    userId: userId,
    code: code,
    status: generateStatus(),
  });
  res.sendStatus(200);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
