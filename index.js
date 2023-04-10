const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const USERS = [
  {
    email: "mayank@gmail.com",
    password: "Singh@gmail.com",
    isAdmin: true,
  },
];

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

const SUBMISSION = [
  {
    title: "Two states",
    email: "Random 101",
    code: "This is one way of doing it for sure",
    result: "Accepted",
  },
  {
    title: "Two states",
    email: "Random 102",
    code: "This is second way of doing it for sure",
    result: "Accepted",
  },

  {
    title: "Five Hundred Square",
    email: "Random 102",
    code: "This is second way of doing it for sure",
    result: "Rejected",
  },
  {
    title: "Merge Two Linked Lists",
    email: "Random 102",
    code: "This is third way of doing it for sure",
    result: "Rejected",
  },
  {
    title: "Two states",
    email: "Random 103",
    code: "This is third way of doing it for sure",
    result: "Rejected",
  },
];

app.post("/signup", function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const admin = req.body.admin;

    let present = false;
    USERS.forEach((data) => {
      if (data.email === email) present = true;
    });

    if (!present) {
      USERS.push({ email, password, admin });
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(409).json({ message: "Email is already in use" });
    }
  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err });
  }
});

app.post("/login", function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    let present = false;
    let correctPassword = false;
    USERS.forEach((data) => {
      if (data.email === email) {
        present = true;
        if (data.password === password) {
          correctPassword = true;
        }
      }
    });

    if (present) {
      if (correctPassword) {
        res
          .status(200)
          .json({ message: "User authorized", token: "Authorization String" });
      } else {
        res.status(401).json({ message: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ message: "User not present" });
    }
  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err });
  }
});

app.get("/questions", function (req, res) {
  try {
    res.status(200).json(QUESTIONS);
  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err });
  }
});

app.get("/submissions", function (req, res) {
  try {
    const problemTitle = req.body.title;
    const submissionsForGivenProblem = SUBMISSION.filter(
      (sub) => sub.title === problemTitle
    );
    res.status(200).json(submissionsForGivenProblem);
  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err });
  }
});

app.post("/submissions", function (req, res) {
  try {
    const email = req.body.email;
    const title = req.body.title;
    const code = req.body.code;
    const result = Math.random() > 0.5 ? "Accepted" : "Rejected";
    const data = {
      title,
      email,
      code,
      result,
    };
    SUBMISSION.push(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err });
  }
});

app.post("/questions", function (req, res) {
  try {
    //first check for authorised person is loggin in?
    const email = req.body.email;
    const title = req.body.title;
    const description = req.body.description;
    const testCases = req.body.testCases;

    let authorised = false;
    USERS.forEach((data) => {
      if (data.email === email && data.isAdmin) {
        authorised = true;
      }
    });

    if (authorised) {
      QUESTIONS.push({
        title,
        description,
        testCases,
      });
      res.status(201).json({ message: "Question created successfully" });
    } else {
      res.status(401).json({ message: "Not authorised" });
    }
  } catch (err) {
    res.status(500).json({ message: "Some error occurred", err });
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
