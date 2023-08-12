const express = require("express");

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const USERS = {
  "admin@email.com": {
    password: "YWRtaW5AMTIz",
    isAdmin: true,
  },
};

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

const SUBMISSION = {};

app.post("/signup", (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;

  if (
    email != null &&
    email != undefined &&
    password != null &&
    password != undefined
  ) {
    if (USERS.hasOwnProperty(email)) {
      res.status(400).send({
        success: false,
        message: "email already exists, try login instead",
      });
      return;
    }

    let hashed_pass = btoa(password);
    USERS[email] = {
      password: hashed_pass,
      isAdmin: false,
    };
    res.status(201).send({
      success: true,
      message: "user succesfully created",
    });
    console.log(USERS);
    return;
  }

  res.status(400).send({
    success: false,
    message: "email and password field are required",
  });
  return;
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (
    email != null &&
    email != undefined &&
    password != null &&
    password != undefined
  ) {
    if (USERS.hasOwnProperty(email)) {
      let hashed_pass = btoa(password);
      if (USERS[email]["password"] == hashed_pass) {
        let token = btoa(`${email}-${password}-${Date.now()}`);
        res.status(200).send({
          success: true,
          message: "user logged in successfully",
          token: token,
        });
        return;
      }

      res.status(401).send({
        success: false,
        message: "password does not match",
      });
      return;
    }

    res.status(400).send({
      success: false,
      message: "user does not exist, try signup instead",
    });
    return;
  }

  res.status(400).send({
    success: false,
    message: "email and password field are required",
  });
  return;
});

app.get("/questions", (_, res) => {
  res.status(200).send({
    success: true,
    data: QUESTIONS,
  });
  return;
});

app.post("/questions", filterAdminOnly, (req, res) => {
  let question = req.body.question;
  if (question != null && question != undefined) {
    QUESTIONS.push(question);
    let questionId = QUESTIONS.length;
    res.status(201).send({
      success: true,
      message: "successfully added new question",
      data: {
        questionId: questionId,
        question: question,
      },
    });
    return;
  }

  res.status(400).send({
    success: false,
    message: "question field is required to add a new question",
  });
  return;
});

app.get("/submissions", function (_, res) {
  res.status(200).send({
    success: true,
    data: SUBMISSION,
  });
  return;
});

app.post("/submissions", function (req, res) {
  let problemId = req.body.problemId;
  let solution = req.body.solution;
  let token = req.body.token;
  console.log("/submissions: ", req.body);
  if (
    problemId != null &&
    problemId != undefined &&
    solution != null &&
    solution != undefined &&
    token != null &&
    token != undefined
  ) {
    let tokenValid = isTokenValid(token);
    if (tokenValid) {
      let email = getEmailFromToken(token);
      if (USERS.hasOwnProperty(email)) {
        let passed = checkSolution(problemId, solution);
        if (passed) {
          if (!SUBMISSION.hasOwnProperty(problemId)) {
            SUBMISSION[problemId] = [];
          }

          SUBMISSION[problemId].push(solution);
          res.status(200).send({
            success: true,
            message: "solution successfully passed",
            data: SUBMISSION[problemId],
          });
          return;
        }

        res.status(400).send({
          success: false,
          message: "solution failed",
        });
        return;
      }

      res.status(400).send({
        sucess: false,
        message: "user does not exist",
      });
      return;
    }

    res.status(400).send({
      sucess: false,
      message: "token is invalid, try logging in again to get a valid token",
    });
    return;
  }

  res.status(400).send({
    success: false,
    message: "token, problemId, solution field are required",
  });
  return;
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

function filterAdminOnly(req, res, next) {
  let token = req.body.token;
  if (token != null && token != undefined) {
    if (isAdmin(token)) {
      next();
    }
  }

  res.status(400).send({
    success: false,
    message: "PROTECTED route, only admin users are allowed",
  });
  return;
}

function isAdmin(token) {
  if (isTokenValid(token)) {
    let email = getEmailFromToken(token);
    if (USERS[email]["isAdmin"]) {
      return true;
    }
    return false;
  }
  return false;
}

function isTokenValid(token) {
  let decodedString = atob(token);
  let decodedStringArr = decodedString.split("-");
  if (decodedStringArr.length == 3) {
    return true;
  }
  return false;
}

function getEmailFromToken(token) {
  let decodedString = atob(token);
  let [email, pass, time] = decodedString.split("-");

  return email;
}

function checkSolution(problemId, solution) {
  let rand = Math.floor(Math.random() * 2);
  return rand == 1 ? true : false;
}
