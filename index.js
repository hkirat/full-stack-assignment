const express = require("express");
const app = express();
const port = 3001;

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post("/signup", function (req, res) {
  try {
    const { name = null, email = null, password = null } = req.body;

    if (!(name && email && password)) {
      throw new Error("name, email and password are required!");
    }

    // Check existing users with same email
    const emailInUse = USERS.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailInUse) {
      throw new Error("User with this email already exists!");
    }

    USERS.push({
      name,
      email: email.toLowerCase(),
      password: password.trim(),
    });

    return res.status(201).json({ success: "Signup successful." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/login", function (req, res) {
  try {
    const { email = null, password = null } = req.body;

    if (!(email && password)) {
      throw new Error("Please enter your email and password!");
    }

    const existingUser = USERS.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password.trim()
    );

    if (!existingUser) {
      throw new Error("Invalid credentials!");
    }

    const token = "aasldkw039uj03iurj28wiuj9w";

    delete existingUser.password;

    const data = {
      user: existingUser,
      token,
    };

    return res.status(200).json({ success: "Login successful", data });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
