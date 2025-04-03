import express from "express";
import bodyParser from "body-bodyParser";

const app = express();
const port = 3001;

const USERS = [
  {
    email: "test@gmai;.com",
    password: "12345",
  },
];

const QUESTIONS = [
  {
    qId: 1,
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
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const user = USERS.find((user) => user.email === email);

  if (!user) {
    const newUser = {
      email: email,
      password: password,
    };
    USERS.push(newUser);
    res.send("Sign up succesful");
  } else {
    res.send("You should login");
  }

  // return back 200 status code to the client
  res.send("Hello World!");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);

  if (!user) {
    res.send("User not found, Register first!!");
  } else {
    if (user.password === password) {
      res.send("jkjkduisdhfui").status(200);
    } else {
      res.status(401);
    }
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
  res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const id_of_question = req.body.questionID;
  const previous_submitted_solutions = [];

  SUBMISSION.forEach((sol) => {
    if (sol.id === id_of_question) {
      previous_submitted_solutions.push(sol);
    }
  });

  res.json(previous_submitted_solutions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const submited_Code = req.body.user_solution;
  const accept_randomly = Math.floor(Math.random() * 2);
  if (accept_randomly) {
    SUBMISSION.push(submited_Code);
  } else {
    res.send("rejecting your solution because bhai ne bola h to krne ka");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/new/problem", (req, res) => {
  const admin = req.body.admin;
  const id = QUESTIONS.length + 1;
  const { title, description, testCases } = req.body;

  if(admin){
    const newQuestion = {
      qId: id,
      title: title,
      description: description,
      testCases: testCases,
    };
    QUESTIONS.push(newQuestion);
  }else{
    res.send("Please be admin!!")
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
