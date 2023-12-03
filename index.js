const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const users = [];

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const questions = [
  {
    id: 1,
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    id: 2,
    title: "Distance b/w two points",
    description: "Write a solution to show the disctance between two points?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    id: 3,
    title: "Multiverse",
    description:
      "Write a solution for making the normal person undertand multiverse?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    id: 4,
    title: "Hello World",
    description: "Print Console log and string should be Hello World?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "Hello World",
      },
    ],
  },
  {
    id: 5,
    title: "Binary Search",
    description: "Craete a solution of binary seacrh?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const submission = [];

let loggedInUser = null;

// GENERATE TOKEN
function generateRandomString(length) {
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

app.post("/signup", (req, res) => {
  // Add logic to decode body
  let postData = req.body;
  // body should have email and password
  if (postData.email && postData.password) {
    if (users.length > 0) {
      let isFound = false;
      users.forEach((item) => {
        if (item.email === postData.email) {
          res.status(400).send("BAD REQUEST!, email already exist");
          isFound = true;
          return;
        }
      });
      if (!isFound) {
        users.push(postData);
        res.status(200).send("Your account has been created!");
      }
    } else {
      users.push(postData);
      res.status(200).send("Your account has been created!");
    }
  } else {
    res.status(400).send("BAD REQUEST!");
  }
  console.log(users);
});

app.post("/login", (req, res) => {
  const token = generateRandomString(10);

  // Add logic to decode body
  let postData = req.body;

  if (!loggedInUser) {
    // body should have email and password
    if (postData.email && postData.password) {
      if (users.length > 0) {
        let isFound = false;
        // Check if the user with the given email exists in the users array
        // Also ensure that the password is the same
        users.forEach((item) => {
          if (
            item.email === postData.email &&
            item.password === postData.password
          ) {
            // If the password is the same, return back 200 status code to the client
            res.status(200).json({
              greeting: "Welcome to LeetCode!",
              token: token, // Also send back a token (any random string will do for now)
            });
            loggedInUser = postData.email;
            isFound = true;
          }
        });
        if (!isFound) {
          // If the password is not the same, return back 401 status code to the client
          res.status(401).send("Invalid credientials!");
        }
      } else {
        res.status(400).send("NO RECORD FOUND!");
        return;
      }
    } else {
      res.status(401).send("BAD REQUEST!");
    }
  } else {
    res.status(200).send("Please logout first!");
  }
});

app.get("/logout", (req, res) => {
  if (loggedInUser) {
    users.forEach((item) => {
      if (item.email === loggedInUser) {
        delete item.token;
        loggedInUser = null;
        res.status(200).send("You have been logged out");
        return;
      }
    });
  } else {
    res.status(200).send("You are not logged in!");
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(questions);
});

app.get("/submissions/:id", function (req, res) {
  // return the users submissions for this problem
  const id = req.params.id;
  console.log(id);
  if (loggedInUser) {
    if (id) {
      console.log(submission);
      const result = submission.filter(
        (item) =>
          item.username === loggedInUser && item.questionId === parseInt(id)
      );
      res.status(200).json(result);
    } else {
      res.status(400).send("BAD REQUEST!");
    }
  } else {
    res.status(401).send("Unauthorized access, please login first!");
  }
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  let userSolution = req.body;

  if (loggedInUser) {
    userSolution = {
      ...userSolution,
      questionId: questions[Math.floor(Math.random() * questions.length)].id,
      username: loggedInUser,
    };
    if (Math.round(Math.random())) {
      // Store the submission in the SUBMISSION array above
      userSolution = {
        ...userSolution,
        status: "Accepted",
      };
      submission.push(userSolution);
      res
        .status(200)
        .send(`Solution Accepted!: ${JSON.stringify(userSolution)}`);
    } else {
      userSolution = {
        ...userSolution,
        status: "Rejected",
      };
      submission.push(userSolution);
      res
        .status(200)
        .send(`Solution Rejected!: ${JSON.stringify(userSolution)}`);
    }
  } else {
    res.status(401).send("Unauthorized access, please login first!");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/createproblem", (req, res) => {
  let postData = req.body;
  if (loggedInUser && loggedInUser === "admin") {
    questions.push({
      id: questions.length + 1,
      ...postData,
    });
    res.status(200).send("Question has been added!");
  } else {
    res.status(401).send("Unauthorized access!");
  }
});

app.listen(port, function () {
  console.log(`leetCode app listening on port ${port}`);
});
