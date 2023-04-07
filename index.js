const express = require("express");
const app = express();
const port = 3001;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let USERS = [];

let QUESTIONS = [
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

let SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  //we can also use the JWT as well to encypt the password.
  let user = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user", //default (if admin specify admin)
  };
  const sameEmail = USERS.some((user) => user.email === req.body.email);
  console.log(sameEmail);
  if (!sameEmail) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    if (req.body.role) user.role = req.body.role;
    USERS = USERS.concat(user);
  } else {
    res.json("email already exist");
  }

  // const result = await user.save();

  res.json(USERS);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
  // res.send("Hello World!");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  let credentials = {
    email: "",
    password: "",
  };
  credentials.email = req.body.email;
  credentials.password = req.body.password;

  USERS.some((user) => {
    if (user.email == credentials.email) {
      if (user.password == credentials.password) {
        if (user.role === "user") res.json({ accessToken: "useraccessToken" });
        else {
          res.json({ accessToken: "adminaccessToken" });
        }
      } else {
        res.json("invalid credentials");
      }
    } else {
      res.json("user doesn't exist");
    }
  });

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  // res.send("Hello World from route 2!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
  // res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  // Here the questions array can have many object so it must have specific id so that it can submit solutions for that particular question
  res.json(SUBMISSION);

  // res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { id, solution } = req.body;

  let x = Date.now();
  let status = false;
  if (x % 2 == 0) {
    status = true;
  }
  SUBMISSION = SUBMISSION.concat({ id, solution });

  res.json({ isAccepted: status, SUBMISSION });
  // res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addquestion", function (req, res) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader.startsWith("Bearer ")) return res.sendStatus(401);
  console.log(authHeader);
  if (authHeader === "Bearer adminaccessToken") {
    const question = {
      id: QUESTIONS.length,
      title: req.body.title,
      description: req.body.description,
      testCases: [
        {
          input: "[1,2,3,4,5]",
          output: "5",
        },
      ],
    };
    QUESTIONS = QUESTIONS.concat(question);
    res.json(QUESTIONS);
  } else {
    res.json("Unauthorized to use this route");
  }

  // res.send("Hello World from route 4!");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
