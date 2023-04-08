const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = 3001;

//MIDDLEWARES
app.use(bodyParser.json()); // Middleware to parse body.

app.use(
  session({
    //Middleware to set session.
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

const requireLogin = (req, res, next) => {
  // Checking authorization on requests.
  if (req.session && req.session.user) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    res.status(401).send("Please Login to continue");
  }
};

//USERS Array to store user information.
const USERS = [];

//List of admins.
const ADMINS = [];

const QUESTIONS = [
  {
    id: 0,
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
  console.log(req.body);
  const newUser = {
    email: req.body.email,
    password: req.body.password,
  };

  //Checking email already exit or not.
  const doesEmailAlredyExits = USERS.find(
    (user) => user.email === newUser.email
  );

  if (doesEmailAlredyExits) {
    res.status(401).send("Email already exits. Try with a different email");
  } else {
    USERS.push(newUser); //Adding new user to USERS Array
    res.status(200); //returning 200 status code.
    res.send("Acoount created sucessfully...");
  }
});

app.post("/login", function (req, res) {
  const Currentuser = {
    email: req.body.email,
    password: req.body.password,
  };

  const isUserPresent = USERS.find(
    (user) =>// Checking whether the user present in USER Array or not.
      user.email === Currentuser.email && user.password === Currentuser.password
  );

  if (isUserPresent) {
    req.session.user = Currentuser.email;// Setting the session for current loggedin user.
    res.status(200);
    res.send("Login Sucessfull...");
  } else {
    res.status(401);
    res.send("Login details incorrect.Retry!");
  }
});

app.get("/questions", requireLogin, function (req, res) {
  res.status(200).send(QUESTIONS);
});

app.get("/submissions", requireLogin, function (req, res) {
  const questionID = req.body.questionID;
  const submissions = SUBMISSION.filter(
    (sub) => // Filtering all the submissions for the current question using the id of the question
      sub.questionId === questionID && req.session.user === sub.submittedBy
  );
  if(submissions){
    res.status(200).send(submissions);
  }
  else{
    res.status(401).send("No submission available...");
  }
});

app.post("/submissions", requireLogin, function (req, res) {
  const newSubmission = {
    submittedBy: req.session.user, // Storing the current user from session so, when displaying all submissions
    questionId: req.body.questionId,// we can get only the submissions made by current user from the submission array.
    submittedAnswer: req.body.submittedAnswer,
    isRejected:
      Math.floor(Math.random() * 11) % 2 === 0 ? "Rejected" : "Accepted", // Randomly accepting or rejecting the submission
  };
  res.status(200).send("Submitted Sucessfully....");
  SUBMISSION.push(newSubmission);
});

app.post("/admin-signup", function (req, res) {
  const newAdmin = {
    email: req.body.email,
    password: req.body.password,
    admin: true,
  };

  //Checking email already exit or not.
  const doesEmailAlredyExits = ADMINS.find(
    (admin) => admin.email === newAdmin.email
  );

  if (doesEmailAlredyExits) {
    res.send("Email already exits. Try with a different email");
  } else {
    ADMINS.push(newAdmin); //Adding new admin to ADMINS Array
    res.status(200); //returning 200 status code.
    res.send("Admin Acoount created sucessfully...");
    // res.redirect('/login');//Redirecting to login page.
  }
});

app.post("/admin-login", function (req, res) {
  const CurrentAdmin = {
    email: req.body.email,
    password: req.body.password,
  };

  const isAdminPresent = ADMINS.find(
    (admin) =>
      admin.email === CurrentAdmin.email &&
      admin.password === CurrentAdmin.password
  );

  if (isAdminPresent) {
    req.session.admin = CurrentAdmin.email;
    req.session.isAdmin = true;   // Setting a variable in session to check admin or not.
    res.status(200).send("Login Sucessfull...");
  } else {
    res.status(401).send("Login details incorrect.Retry!");
  }
});

app.post("/add-question", function (req, res) {
  if (req.session.isAdmin === true) {  // Checking session variable isAdmin true or false.
    const newQuestion = {
      id: QUESTIONS[QUESTIONS.length - 1].id + 1,
      title: req.body.title,
      description: req.body.description,
      testCases: [
        {
          input: req.body.testCases[0].input,
          output: req.body.testCases[0].output,
        },
      ],
    };
    console.log(newQuestion);
    QUESTIONS.push(newQuestion);
    res.status(200).send("Question added sucessfully");
    console.log("new question :" + QUESTIONS);
  } else {
    res.status(401).send("Please login as admin to add questions...");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
