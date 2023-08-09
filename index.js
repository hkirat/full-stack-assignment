const express = require("express");
const os = require("os");
const bp = require("body-parser");

const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

const USERS = [
  {
    username: "admin",
    password: "123",
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


  {
    title: "N Queens",
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

app.use(bp.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  // res.send('Hello World!')
  res.sendFile("index.html", { root: __dirname });
});

app.post("/signup", function (req, res) {
  let obj1 = req.body;
  let uname = obj1.name;
  let upass = obj1.password;

  USERS.forEach(element => {
    if (element.username == uname && element.password == upass) {
      res
        .setHeader("Secret-Token", "Usedtostaylogedin")
        .send("Already a user!");
    } else {
      USERS.unshift({
        username: uname,
        password: upass,
      })
      // console.log(USERS);
      res.send("Hello World!");
    }
  });

  // Add logic to decode body
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // res.send(user);
  // return back 200 status code to the client
});

app.post("/login", function (req, res) {
  //   // Add logic to decode body
  //   // body should have email and password
  //   // Check if the user with the given email exists in the USERS array
  //   // Also ensure that the password is the same
  //   // If the password is the same, return back 200 status code to the client
  //   // Also send back a token (any random string will do for now)
  //   // If the password is not the same, return back 401 status code to the client
  //   res.send('Hello World from route 2!')
  let obj1 = req.body;
  let uname = obj1.name;
  let upass = obj1.password;

  USERS.forEach(element => {
    if (element.username == uname && element.password == upass) {
      res.setHeader("Secret-Token", "Usedtostaylogedin").send("helo");
    } else res.send("Try Again!");
  });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  // res.send("Hello World from route 3!");

  fs.readFile(path.join(__dirname, "questions.html"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading HTML file.");
    }
    const questionsList = generateQuestionsList(QUESTIONS);
    function generateQuestionsList(questions) {
      return questions
        .map((question) => {
          var obj = question.testCases;
          // console.log(obj[0])
          const inp = obj[0];
          return `<li>${question.title}</li> <li>${question.description}</li> <li>Sample Input: ${inp.input}</li><li> Output: ${inp.output}</li> <hr>`;
        })
        .join("");
    }

    const modifiedHtml = data.replace("{{QUESTIONS_LIST}}", questionsList);

    res.send(modifiedHtml);
    // res.send(htmlContent);
    // res.json(QUESTIONS)
  });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  // res.send("Hello World from route 4!")
  let obj2 = req.body;
  let solution= obj2.ans;
  console.log()
  SUBMISSION.push(
   {solution}
  );
  console.log(SUBMISSION)
  // res.send("added")
  res.send(SUBMISSION);



});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});


