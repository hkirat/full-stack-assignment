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

app.get("/", (req, res) => {
  res.send("Hey man, how you doing");
});

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body();

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const userExists = USERS.find((user) => user.email === email);
  if (userExists) {
    // User already exists, return 409 Conflict status
    return res.status(409).send("User with this email already exists.");
  }

  USERS.push({ emain, password });

  // return back 200 status code to the client
  res.send("Signup successfully.");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body();

  // body should have email and password

  if (!email || !body) {
    return res
      .status(409)
      .send("You must fill all the details(email and password)).");
  }

  // Check if the user with the given email exists in the USERS array

  const userExists = USERS.find((user) => user.email === email);
  // If the password is the same, return back 200 status code to the client
  if (userExists.email) {
    // Ensure that the password is the same
    if (userExists.password === password) {
      // Also send back a token (any random string will do for now)
      const token = "some_secure_token";
      return res.status(200).json({ msg: "Logged in successfully", token });
    }
    // If the password is not the same, return back 401 status code to the client
    return res.status(403).send("Wrond credentials.");
  }

  return res.status(401).send("User with provided credentials doens't exists.");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { queId, solution } = req.body;

  const random = Math.ceil(Math.random() * 2);

  if (random % 2 === 0) {
    // SOLUTION ACCEPTED
    SUBMISSIONS.push({
      queId,
      solution,
    });
    res.status(200).json({ msg: "Solution accepted!" });
  }

  res.status(400).json({ msg: "Solution rejected!" });
});

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/admin/addQuestion", (req, res) => {
  if (req.user.isAdmin) {
    QUESTIONS.push({
      title,
      description,
      testCases,
    });
    res.status(200).json({ message: "Problem added successfully!" });
  }
  res.status(401).json({
    message:
      "You aren't authorized to add new questions. If you think, there is some issue. Then kindly seek help from our support.",
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
