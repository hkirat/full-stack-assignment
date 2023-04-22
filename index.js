const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const USERS = [
  { email: "john@email", password: "password1", userType: "admin" },
  { email: "jane@email", password: "password2", userType: "user" },
  { email: "jim@email", password: "password3", userType: "user" },
  // more objects here...
];

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
  {
    id: 2,
    title: "Three states",
    description: "Given an array , return the minimum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "1",
      },
    ],
  },
];

// this array stores the data of all the submissions from all the users of the platform
// the shape will probably be changed later
const SUBMISSIONS = [
  {
    userEmail: "john@email",
    submissions: [
      {
        questionId: 1,
        code: "",
        status: "ACC",
      },
      {
        questionId: 1,
        code: "",
        status: "WA",
      },
      {
        questionId: 2,
        code: "",
        status: "TLE",
      },
    ],
  },
  {
    userEmail: "jane@email",
    submissions: [
      {
        questionId: 1,
        code: "",
        status: "ACC",
      },
      {
        questionId: 2,
        code: "",
        status: "WA",
      },
      {
        questionId: 2,
        code: "",
        status: "ACC",
      },
    ],
  },
];

// simple login page will be rendered
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// simple signup page will be rendered
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  let email = req.body.email;
  let password = req.body.pass;
  let userType = req.body.userType;

  if (userType != "admin") userType = "user";

  const user = USERS.find((user) => user.email === email);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!user) {
    const newUser = {
      email: email,
      password: password,
      userType: userType,
    };

    USERS.push(newUser);
    // return back 200 status code to the client
    res.status(200).json({ token: "new user added!" });
  }

  res.status(409).json("user already exists!");

});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  let email = req.body.email;
  let password = req.body.pass;

  const user = USERS.find((user) => user.email === email);
  // Check if the user with the given email exists in the USERS array
  if (!user) res.status(401).json({ token: "email not found" });
  // Also ensure that the password is the same
  else if (user.password === password)
    res.status(200).json({ token: "login successful" });
  else res.status(401).json({ token: "password does not match" });
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  let userEmail = req.query.email;
  let questionId = req.query.questionId;

  const sub = SUBMISSIONS.find((sub) => sub.userEmail === userEmail);

  if (sub) {
    const questionSubmissions = sub.submissions.filter(
      (submission) => submission.questionId == questionId
    );
    res.status(200).json(questionSubmissions);
  } else res.status(401).send("No submissions found");
});

app.post("/submissions", function (req, res) {
  const userEmail = req.body.email;
  const questionId = req.body.questionId;
  const code = req.body.code;
  const status = Math.random() >= 0.5 ? "ACC" : "WA";
  
  // let the user submit a problem, randomly accept or reject the solution
  const user = SUBMISSIONS.find((user) => user.userEmail === userEmail);
  const submission = {
    questionId: questionId,
    code: code,
    status: status,
  };
  
  // Store the submission in the SUBMISSIONS array above
  // if the user is submitting for the first time
  if (!user) {
    // create a new entry for the SUBMISSIONS array
    const newUser = {
      userEmail: userEmail,
      submissions: [submission],
    };

    // add the new user to the SUBMISSIONS array
    SUBMISSIONS.push(newUser);

    // send a status and a json token
    // token type/shape might be changed later
    res.status(200).json({
      token: "new user added",
      user: newUser
    });
  } else {
    // if user already exists, just add the new submission to the submissions array
    user.submissions.push(submission);
    res.status(200).json({
      token: "user submission added",
      user: user
    });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
// ASSUMPTION : only a registered user(admin/non-admin) can access this route
app.post('/addquestion', (req, res) => {
  const userEmail = req.body.email
  const user = USERS.find((user) => user.email === userEmail)
  
  // if the user is an admin
  if(user.userType === "admin"){
    const questionId = req.body.questionId
    const title = req.body.title
    const description = req.body.description

    // the testcases will be input as a json string
    const testCases = req.body.testCases

    // create a new entry for a question
    const newQuestion = {
      id: questionId,
      title: title,
      description: description,
      testCases: JSON.parse(testCases), // parse the data from json string as a json object
    }

    // add the new question to the QUESTIONS array
    QUESTIONS.push(newQuestion)
    res.status(200).json(QUESTIONS)
  }
  // if user is not an admin
  else
    res.status(401).send("Unauthorized user")
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
