const express = require("express");
const uuid = require("uuid");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const port = 4545;
app.use(express.json());

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
  //signup logic

  try {
    const { email, password } = req.body;

    if (email === undefined || password === undefined) {
      return res.status(400).send({
        status: false,
        message: "Email or password not found!",
      });
    }

    const user_id = uuid.v4();

    role = "admin";

    const emailExist = USERS.find((user) => user.email === email);

    if (emailExist) {
      return res.status(400).send({
        status: false,
        message: "Email already exists",
        Users: USERS,
      });
    }

    const user = {
      user_id: user_id,
      email: email,
      password: password,
      role: role,
    };

    USERS.push(user);

    return res.status(200).send({
      status: true,
      message: "User added successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", function (req, res) {
  try {
    const { email, password } = req.body;

    const emailExist = USERS.find(
      (user) => user.email === email && user.password === password
    );

    if (!emailExist) {
      return res.status(400).send({
        status: false,
        message: "Email or Password Incorrect!",
      });
    }

    const token = jwt.sign(
      {
        userId: emailExist.user_id,
        role: emailExist.role,
      },
      "thisistoken"
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // Token will expire after 7 days
        sameSite: "strict", // Prevents CSRF attacks
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      })
    );

    res.status(200).send({
      status: true,
      message: "Login Success",
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/questions", function (req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    res
      .status(200)
      .send({ status: true, message: "All questions", questions: QUESTIONS });
    res.send("Hello World from route 3!");
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
});

app.get("/submissions", function (req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }
  const decoded = jwt.verify(token, "thisistoken");

  let my_submissions = [];
  for (i in SUBMISSION) {
    if (i.user_id == decoded.user_id) {
      my_submissions.push(i);
    }
  }

  return res.status(200).send({ status: true, submission: my_submissions });
});

app.post("/submissions", function (req, res) {
  try {
    const { id, title, solution } = req.body;

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, "thisistoken");

    const idExits = QUESTIONS.find((elem) => elem.id === id);

    if (!idExits)
      return res
        .status(400)
        .send({ status: false, message: "This question doesnot exist" });

    if (idExits.title != title)
      return res.status(400).send({
        status: false,
        message: "The title should be same as original",
      });

    const submission = {
      id: id,
      title: title,
      solution: solution,
      user_id: decoded.user_id,
    };

    const accept = Math.random();
    if (accept < 0.3)
      return res
        .status(400)
        .send({ status: false, message: "Submission Not Accepted! Try Again" });

    SUBMISSION.push(submission);

    res.status(200).send({
      status: true,
      message: "Submission Accepted",
      totalSubmissions: SUBMISSION,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addProblem", function (req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }
  const decoded = jwt.verify(token, "thisistoken");

  if (decoded.role !== "admin") {
    return res.status(401).send({ message: "You are not admin" });
  }

  const { title, description, testCases } = req.body;

  if (!testCases || !description || !title) {
    res.status(401).send({
      message: "Please provide a description or test cases or description",
    });
  }

  const question = {
    title: title,
    description: description,
    testCases: testCases,
  };

  QUESTIONS.push(question);
  res.status(200).send({
    status: true,
    questions: QUESTIONS,
  });
});

app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});
