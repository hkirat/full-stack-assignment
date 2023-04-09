const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
let LOGGED = false;
app.use(bodyParser.urlencoded({ extended: true }));
const USERS = [];
const fs = require("fs");

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

const SUBMISSION = ["This is a submission"];

const path = require("path");

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

app.get("/signMeUp", function (req, res) {
  res.sendFile(path.join(__dirname, "Public", "signUp.html"));
});

app.get("/logMeIn", function (req, res) {
  console.log(USERS);
  res.sendFile(path.join(__dirname, "Public", "logIn.html"));
});

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  const userExists = USERS.some((user) => user.email === email);
  if (userExists) {
    return res.status(400).send("User already exists");
  }

  let hashedPass = simpleHash(password);
  USERS.push({ email, hashedPass });

  res.status(200).sendFile(path.join(__dirname, "Public", "userCreated.html"));
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  const hashedPass = simpleHash(password);
  console.log(hashedPass);
  const validate = USERS.some(
    (user) => user.email == email && user.hashedPass == hashedPass
  );
  console.log(validate);
  if (!validate) {
    return res.status(401).send("Invalid user");
  }
  const token = "wqeqweqweqweqwesdfsdfsdfcxvxcv";
  LOGGED = true;
  const filePath = path.join(__dirname, "Public", "userHome.html");
  res.status(200).sendFile(filePath);
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  if (!LOGGED) {
    res.send("Not logged in");
  }
  const filePath = path.join(__dirname, "Public", "displayQuestions.html");
  res.sendFile(filePath);
});
app.get("/question", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  if (!LOGGED) {
    res.send("Not logged in");
  } else {
    res.json(QUESTIONS);
  }
});

app.get("/logout", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  LOGGED = false;
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});
app.get("/submissions", function (req, res) {
  // Read the contents of the HTML file
  if (!LOGGED) {
    res.send("Not logged in");
  } else {
    fs.readFile(
      path.join(__dirname, "Public", "submission.html"),
      "utf8",
      function (err, html) {
        if (err) {
          console.log(err);
          return res.status(500).send("Error reading file");
        }

        // Replace the placeholder with the actual data
        html = html.replace(
          "<%= submissions %>",
          JSON.stringify(SUBMISSION[0])
        );

        // Send the resulting HTML to the client
        res.send(html);
      }
    );
  }
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  const submission = req.body;
  SUBMISSION.pop();
  SUBMISSION.push(submission);
  console.log(SUBMISSION);
  res.send("");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash;
}
