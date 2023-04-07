const express = require("express");
const app = express();
const port = 3000;

const USERS = [];

const QUESTIONS = [
  {
    id: 1,
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

const SUBMISSION = [

];

app.use(express.json());

app.get("/", function (req, res) {
  res.send({ message: "Hey!" });
});

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  if (!email || !password) {
    return res.status(401).send({ message: "Invalid email or password" });
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.some((user) => user.email === email);

  if (userExists)
    return res.status(404).send({ message: "User already exists" });

  // return back 200 status code to the client
  if (!userExists) {
    USERS.push({
      email,
      password,
      userId: Math.floor(Math.random() * 100) + 1,
    });
    res.status(201).send({ message: "User registered successfully" });
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  if (!email || !password) {
    return res.status(401).send({ message: "Invalid email or password" });
  }

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);

  // If the user doesn't exist, return 401
  if (!user) {
    return res.status(401).send({ message: "User not found" });
  }
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if (user.password === password) {
    return res
      .status(200)
      .send({ message: "Login successfully", token: `token${email}secret` });
  }

  // If the password is not the same, return back 401 status code to the client
  if (user.password !== password) {
    return res.status(401).send({ message: "Invalid credentials" });
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  const questions = QUESTIONS.map((que) => {
    return que.title;
  });
  res.status(200).send({ questions: questions });
});

app.get("/submissions/:id", function (req, res) {
  const { id } = req.params;
  // return the users submissions for this problem
  const submissions = SUBMISSION.filter(
    (submission) => submission.questionId === id
  );

  if (!submissions) {
    return res.status(400).send({ message: "No submissions" });
  }

  res.status(200).send({ submissions: submissions });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  SUBMISSION.push(req.body);
  const accepted = Math.random() < 0.5;
  res.status(200).send({ message: accepted ? "Accepted" : "Rejected" });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// create a middleware function to check if user is an admin
function checkAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Access denied!");
  }
}

// ensure that only admins can do that.
app.post("/problems", checkAdmin, function (req, res) {
  // route for admins to add a new problem
  PROBLEMS.push(req.body);
  res.send("Problem added successfully!");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
