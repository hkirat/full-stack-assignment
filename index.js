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

class Question {
  constructor(title, description, testCases) {
    this.title = title;
    this.description = description;
    this.testCases = testCases;
  }
}

const SUBMISSION = {};

class Submission {
  constructor(solution, status) {
    this.solution = solution;
    this.status = status;
  }
}

class User {
  constructor(email, password, isAdmin) {
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  for (let i = 0; i < USERS.length; i++) {
    let user = USERS[i];
    if (user.email === email) {
      return res.status(200).send("A User with the Given email already exists");
    }
  }

  const newUser = new User(email, password, Math.floor(Math.random() * 2));
  USERS.push(newUser);

  // return back 200 status code to the client
  return res.status(200).send("Your Sucessfully Signed Up");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same.
  for (let i = 0; i < USERS.length; i++) {
    let user = USERS[i];
    if (user.email === email) {
      if (user.password === password) {
        return res.status(200).header("sgsdfnksdwlntkmdsfnsfmf");
      } else {
        return res.status(401).send("Incorrect Password");
      }
    }
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  return res.status(401).send("A User with the given email doesnt exists");
});

app.get("/questions", function (req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { questionId } = req.body;

  if (!questionId) return res.status(401).send("Please Provide a questionID");

  res.json(SUBMISSION[questionId]);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { questionId, solution } = req.body;
  const accepted = Math.floor(Math.random() * 2);

  if (!(questionId in SUBMISSION)) SUBMISSION[questionId] = [];

  if (accepted) {
    SUBMISSION[questionId].push(new Submission(solution, "Accepted"));
    return res.send("CORRECT ANSWER");
  } else {
    SUBMISSION[questionId].push(new Submission(solution, "Rejected"));
    return res.send("WRONG ANSWER");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addProblem", function (req, res) {
  const { email, title, description, testCases } = req.body;

  for (let i = 0; i < USERS.length; i++) {
    const user = USERS[i];

    if (user.email === email) {
      if (!user.isAdmin)
        return res.status(403).send("Only Admins Can Add Problems");

      const newQuestion = new Question(title, description, testCases);
      QUESTIONS.push(newQuestion);
      return res.status(200).send("Successfully Added the Problem");
    }
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
