const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

// Define a secret key for JWT tokens
const JWT_SECRET = "my-secret-key";
// Salt number for bcrypy
const SALT_NUMBER = 10;

const USERS = [];

const QUESTIONS = [
  {
    questionId: 1,
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

const SUBMISSIONS = [];

app.use(bodyParser.json());

// Configure the session middleware
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const loginRequired = (req, res, next) => {
  if (req.session && req.session.userId) {
    // The user is logged in, so allow access to the route
    next();
  } else {
    // The user is not logged in, so redirect to the login page
    res.status(401).json({ error: "Authentication required" });
  }
};

app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please provide a email and password" });
  }

  const user = USERS.find((user) => user.email === email);

  if (user) {
    res.status(409).json({ message: "email already exists" });
  }

  const salt = bcrypt.genSaltSync(SALT_NUMBER);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create a new user object
  const newUser = {
    id: USERS.length + 1,
    email: email,
    password: password,
    isAdmin: false, // not an admin user by default
  };

  USERS.push(newUser);

  req.session.userId = newUser.id;
  req.session.isAdmin = newUser.isAdmin;

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
  res.json({ token });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please provide a email and password" });
  }

  const user = USERS.find((user) => user.email === email);

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.userId = user.id;
  req.session.isAdmin = user.isAdmin;

  console.log(req.user);

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.json({ token });
});

app.get("/questions", (req, res) => {
  res.json(QUESTIONS);
});

app.get("/submissions", loginRequired, (req, res) => {
  // return the users submissions for this problem
  res.json(SUBMISSIONS);
});

app.post("/submissions", loginRequired, (req, res) => {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { questionId, solution } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  const submission = {
    userId: req.session.userId,
    questionId: questionId,
    solution: solution,
    isAccepted: isAccepted,
  };

  // Store the submission in the SUBMISSION array
  SUBMISSIONS.push(submission);

  res.json({ isAccepted: isAccepted });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addQuestion", (req, res) => {
  if (req.session && !req.session.isAdmin) {
    return res.status(403).json({ error: "Access denied" });
  }

  const { title, description, testCases } = req.body;

  const question = {
    questionId: QUESTIONS.length + 1,
    title,
    description,
    testCases,
  };

  QUESTIONS.push(question);

  res.status(200).json("Question Added");
});

// Create an admin user
const adminUser = {
  id: 1,
  email: "admin@gmail.com",
  password: bcrypt.hashSync("admin", bcrypt.genSaltSync(SALT_NUMBER)),
  isAdmin: true,
};
USERS.push(adminUser);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
