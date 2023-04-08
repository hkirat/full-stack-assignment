const fs = require("fs");
const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

// importing data from local datastore
let PROBLEMS = JSON.parse(fs.readFileSync("./data/problems.json", "utf-8"));
let USERS = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
let SUBMISSIONS = JSON.parse(
  fs.readFileSync("./data/submissions.json", "utf-8")
);

// utilities
let CURRENT_USER = {};

const isLoggedIn = () => {
  return Object.keys(CURRENT_USER).length !== 0;
};

// GET
app.get("/problems", function (req, res) {
  if (!isLoggedIn()) {
    res.status(401).json({ message: "Please login to continue" });
  } else {
    //return the user all the questions in the QUESTIONS array
    res.status(200).json(PROBLEMS);
  }
});

app.get("/submissions", function (req, res) {
  if (!isLoggedIn()) {
    res.status(401).json({ message: "Please login to continue" });
  } else {
    // return the users submissions for this problem
    const problem_id = req.body.problem_id;
    if (!problem_id) {
      res.status(404).json({ error: "Invalid problem id" });
    } else {
      res
        .status(200)
        .json(
          SUBMISSIONS.filter(
            (submission) =>
              submission.problem_id === problem_id &&
              submission.user_id === CURRENT_USER.user_id
          )
        );
    }
  }
});

app.get("/logout", (req, res) => {
  if (!isLoggedIn()) {
    res.status(404).json({ message: "Please log in to continue" });
  } else {
    CURRENT_USER = {};
    res.status(200).json({ message: "Logged out successfully" });
  }
});

// POST
app.post("/signup", function (req, res) {

  const { username, name, email, password } = req.body;

  // request data if not present
  if (!username || !name || !email || !password) {
    res
      .status(400)
      .json({ error: "Please provide username, name, email and password" });
  } else {
    if (
      username &&
      USERS.filter((user) => user.username === username).length > 0
    ) {
      res.status(409).json({ error: "Username already in use!" });
    } else if (
      email &&
      USERS.filter((user) => user.email === email).length > 0
    ) {
      res.status(409).json({ error: "Email already in use!" });
    } else {
      // return back 200 status code to the client
      const newUser = {
        username,
        email,
        password,
        solved_problems: 0,
        submission_count: 0,
        authority: "user",
      };
      USERS = [...USERS, newUser];
      CURRENT_USER = newUser;
      fs.writeFileSync("./data/users.json", JSON.stringify(USERS));
      res.status(201).json({ message: "Leetcoder registered successfully" });
    }
  }
});

app.post("/login", function (req, res) {
  if (isLoggedIn()) {
    res.status(200).json({ message: "Already logged in" });
  } else {
    // Add logic to decode body
    // body should have email and password
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      res.status(404).json({ error: "Invalid Credentials" });
    } else if (username && password) {
      const users = USERS.filter(
        (user) => user.username === username && user.password === password
      );
      if (users.length === 0) {
        res.status(404).json({ error: "Invalid Credentials" });
      } else {
        CURRENT_USER = users[0];
        res.status(200).json({ message: "Logged in successfully" });
      }
    } else {
      const users = USERS.filter(
        (user) => user.email === email && user.password === password
      );
      if (users.length === 0) {
        res.status(404).json({ error: "Invalid Credentials" });
      } else {
        CURRENT_USER = users[0];
        res.status(200).json({ message: "Logged in successfully" });
      }
    }
  }
});

app.post("/submissions", function (req, res) {
  if (!isLoggedIn()) {
    res.status(401).json({ message: "Please login to continue" });
  } else {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const { problem_id, language, solution, result, runtime } = req.body;
    const newSubmission = {
      username: CURRENT_USER.username,
      problem_id,
      submission_id: Math.floor(Math.random() * 100).toString(),
      language,
      solution,
      result,
      runtime,
      timestamp: new Date(),
    };
    SUBMISSIONS = [...SUBMISSIONS, newSubmission];
    fs.writeFileSync("./data/submissions.json", JSON.stringify(SUBMISSIONS));
    res.status(201).json({
      message: "Submission successful",
      solution,
    });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/problems", (req, res) => {
  if (!isLoggedIn()) {
    res.status(401).json({ message: "Please login to continue" });
  } else if (CURRENT_USER.authority !== "admin") {
    res.status(401).json({ message: "Forbidden" });
  } else {
    const { title, difficulty, description, solution, topic, testcases } =
      req.body;
    const same_problem = PROBLEMS.filter((problem) => problem.title === title);
    if (same_problem.length > 0) {
      res.status(400).json({ error: "Problem with same title already exists" });
    } else {
      const newProblem = {
        id: title.toString().replaceAll(" ", "-").toLowerCase(),
        title,
        difficulty,
        description,
        solution,
        topic,
        testcases,
      };
      PROBLEMS = [...PROBLEMS, newProblem];
      fs.writeFileSync("./data/problems.json", JSON.stringify(SUBMISSIONS));
      res.status(201).json({
        message: "Problem added successfully",
        problem: newProblem,
      });
    }
  }
});

app.listen(port, function () {
  console.log(`App listening on port: ${port}`);
});
