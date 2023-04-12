const express = require("express");
const app = express();
const port = 3001;
// initializing middleware to get req.body
app.use(express.json());
// this array contains the users
const USERS = [];
// credentials for admin
const ADMIN = {
  email: "admin@gmail.com",
  password: 1234,
};
// flag to notify whether the admin is logged in
let adminlogedin = false;
// this array contains the questions
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
// this array contains the submitted questions by users
const SUBMISSION = [];

// signup route to register the user
app.post("/signup", function (req, res) {
  const { email, password } = req.body;
  if (email && password) {
    let existuser = USERS.some((e) => e.email === email);
    if (existuser) {
      res.status(406).json({ status: false, msg: "email already exists" });
    } else {
      USERS.push(req.body);
      res.status(200).json({ status: true, msg: "user sucessfully added" });
    }
  } else {
    res
      .status(404)
      .json({ status: false, msg: "email and password not accepted" });
  }
});

// login route to authenticate the user
app.post("/login", function (req, res) {
  const { email, password } = req.body;
  if (email && password) {
    let existuser = USERS.find((e) => e.email === email);
    if (existuser) {
      if (existuser.password === password) {
        res.status(200).json({ status: true, msg: "userloged in sucessfully" });
      } else {
        res.status(401).json({ status: false, msg: "invalid credentials" });
      }
    } else {
      res.status(404).json({ status: false, msg: "user not found" });
    }
  } else {
    res
      .status(404)
      .json({ status: false, msg: "email and password not accepted'" });
  }
});

// questions route to get all questions posted by admin
app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ status: true, questions: QUESTIONS });
});

// submission route for users to view all submissions
app.get("/submissions", function (req, res) {
  res.status(200).json({ status: true, SUBMISSION });
});

//submission post route for users to submit the answers
app.post("/submissions", function (req, res) {
  const { id, answer } = req.body;
  const isacepted = Math.random() >= 0.5;
  if (id && answer) {
    const subobj = {
      id,
      answer,
      isacepted,
    };
    SUBMISSION.push(subobj);
    res.status(201).json({ status: true, msg: "answer submited" });
  } else {
    res.status(404).json({ status: false, msg: "answer cannote submit" });
  }
});

// adminlogin route to authenticate the admin
app.post("/adminlogin", function (req, res) {
  const { email, password } = req.body;
  if (email && password) {
    let isadmin = ADMIN.email === email;
    //console.log(existuser)
    if (isadmin) {
      if (ADMIN.password === password) {
        adminlogedin = true;
        res
          .status(200)
          .json({ status: true, msg: "adminloged in sucessfully" });
      } else {
        res.status(401).json({ status: false, msg: "invalid credentials" });
      }
    } else {
      res.status(404).json({ status: false, msg: "admin not found" });
    }
  } else {
    res
      .status(404)
      .json({ status: false, msg: "email and password not accepted'" });
  }
});

// addquestions route for the admin to add new questions
app.post("/addquestion", (req, res) => {
  if (adminlogedin) {
    const { id, title, description, testCases } = req.body;
    if (id && title && description && testCases.length) {
      QUESTIONS.push(req.body);
      res.status(201).json({ status: true, msg: "question is added" });
    } else {
      res.status(404).json({ status: false, msg: "all fields are required" });
    }
  } else {
    res.status(404).json({ status: false, msg: "admin not found" });
  }
});

// server is starting
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
