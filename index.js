const express = require("express");
const app = express();
const port = 3001;
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var USERS = [];

class ResponseHandler{
  success(status_code, message, response){
      return {
          code : status_code,
          message: message,
          response : response
      };
  }

  failure(status_code, message, response){
      return {
          code : status_code,
          message: message,
          response : response
      }
  }
}

const handler = new ResponseHandler();

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

app.get("/", function (req, res) {
  res.send(QUESTIONS);
});

app.post("/signup", function (req, res) {
  console.log("USERS : ", USERS)
  var user = req.body;
  console.log(user.email);

  if (USERS.some((u) => u.email === user.email)) {
    res.send(handler.failure(401, "user already exist", {}));
  } else {
    USERS.push(user);
    res.send(handler.success(200, "Successful", user));
  }
});


app.post("/login", (req, res) => {
  var user = req.body;
  const foundUser = USERS.find((u) => u.email === user.email);

  if (foundUser && foundUser.password === user.password) {
    var response = handler.success(200, "Success", user);
    res.send(response);
  } else {
    res.send(handler.failure());
  }
});

app.get("/questions", function (req, res) {
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  res.send(SUBMISSION)
});

app.post("/submissions", function (req, res) {
  const isAccepted = Math.random() < 0.5;

  const submission = {
    user: req.body.user,
    question: req.body.question,
    isAccepted: isAccepted,
  };

  SUBMISSIONS.push(submission);
  res.send(handler.success(200, "Submission received", submission));
});

function isAdmin(req, res, next) {
  const userEmail = req.body.user.email;
  const user = USERS.find(u => u.email === userEmail);
  
  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).send('Permission denied. Only admins can perform this action.');
  }
}

app.post('/add-problem', isAdmin, (req, res) => {
  // isAdmin middleware makes sure that only admins can call the endpoint
  const newProblem = req.body.newProblem; 
  res.send(handler.success(200, 'Problem added successfully', newProblem));
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
