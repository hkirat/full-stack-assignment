const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");

const USERS = [
  { username: "akash", password: "akash1", isAdmin: true },
  { username: "vaibhav", password: "vaibhav1", isAdmin: false },
];

const QUESTIONS = [
  {
    title: "Max find",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    title: "Factorial",
    description: "Find the factorial of a given n value",
    testCases: [
      {
        input: "4",
        output: "12",
      },
    ],
  },
  {
    title: "sum",
    description: "Find the sum of the given elements in an array",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "15",
      },
    ],
  },
];

const SUBMISSION = [];
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//home route
app.get("/", (req, resp) => {
  resp.send("Home page of dummy leetcode");
});

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { username, password } = req.body;

  const index = USERS.findIndex((user) => user.username === username);
  if (index == -1) {
    USERS.push({ username: username, password: password });
    res.status(200).send("Successfull sign up");
  } else {
    res.status(401).send("User already exist");
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { username, password } = req.body;
  const index = USERS.findIndex((user) => user.username === username);
  if (index != -1) {
    if (USERS[index].password === password) {
      res.status(200).json({ token: "abcdefghi" });
    } else {
      res.status(401).send("Wrong password");
    }
  } else {
    res.status(401).send("User does not exist please sign up");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  // to send only title of questions
  //const title = QUESTIONS.map((item) => item.title);

  //to send all questions
  res.status(200).json({ QUESTIONS });
});

app.post("/Submissions", function (req, res) {
  // submit the users submissions for a problem
  const { name, title, output } = req.body;

  const name_ind = USERS.findIndex((user) => user.username === name);
  const index = QUESTIONS.findIndex((item) => item.title === title);
  if (name_ind != -1) {
    if (QUESTIONS[index].testCases[0].output === output) {
      SUBMISSION.push({
        name: name,
        titile: title,
        output: output,
        score: "1",
      });
      res
        .status(200)
        .send("Submission successfull : " + JSON.stringify(SUBMISSION));
    } else {
      res.status(401).send("Submission Unsuccessfull");
    }
  } else {
    res.status(401).send("Please signup before submitting");
  }
});

app.get("/mySubmissions", (req, resp) => {
  const { name } = req.body;
  const data = SUBMISSION.filter((user) => user.name == name);
  if (data.length != 0) {
    resp.status(200).send(JSON.stringify(data));
  } else {
    resp.status(401).send("You have not submit any questions yet");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
//route to add question/problems

app.post("/addQuestions", (req, resp) => {
  const { name, problem } = req.body;
  const index = USERS.findIndex((user) => user.username == name);
  if (index != -1 && USERS[index].isAdmin) {
    QUESTIONS.push(problem);
    resp.status(200).send("Problem added : " + JSON.stringify(problem));
  } else {
    resp.status(200).send("You are not authorized to add questions");
  }
});

//application is running on this port
app.listen(port, function () {
  console.log(`app listening on port ${port}`);
});
