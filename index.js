const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3001;

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

const USERS = [];

const QUESTIONS = [
  {
    id: "1",
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
    id: "2",
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

const SUBMISSION = {
  "hello@example.com": [
    { problemId: "1", codes: ["code1", "code2", "code3"] },
    { problemId: "2", codes: ["code1", "code2", "code3"] },
    { problemId: "3", codes: ["code1", "code2", "code3"] },
  ],

  xyz: [
    { problemId: "1", codes: ["code1", "code2", "code3"] },
    { problemId: "2", codes: ["code1", "code2", "code3"] },
    { problemId: "3", codes: ["code1", "code2", "code3"] },
  ],
};

const tokenRecord = new Map();

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  const { email, password, isAdmin = false } = req.body;
  const emails = USERS.map((userData) => userData.email);
  if (!emails.includes(email)) {
    USERS.push({ userId:USERS.length,email, password, isAdmin });
    res
      .status(201)
      .send(`Successfully created account for user ${req.body.email}`);
  } else {
    res.status(400).send(`User ${req.body.email} already exists!!!`);
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const { email, password } = req.body;

  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email && USERS[i].password === password) {
      const token = Math.random().toString(36); 
      tokenRecord.set(email, token);

      res.cookie("token", token, {
        maxAge: 3600,
        httpOnly: true,
        sameSite: "lax",
      });

      res.cookie("email", email, {
        maxAge: 3600,
        httpOnly: true,
        sameSite: "lax",
      });

      return res.status(200).json({
        message: "Congrats, you are logged in!!!",
      });
    }
  }
  return res.status(401).json({
    message: "Check email or password!!!",
  });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  if (
    !req.cookies.token ||
    req.cookies.token !== tokenRecord.get(req.cookies.email)
  ) {
    res.status(401).send("Unauthorized!");
  } else {
    res.send(JSON.stringify(QUESTIONS));
  }
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const token = req.cookies.token;
  const email = req.cookies.email;
  if (!token || token !== tokenRecord.get(email)) {
    res.status(401).send("Unauthorized!");
  } else {
    res.send(
      JSON.stringify(
        !SUBMISSION[email]
          ? "No submissions By this user"
          : SUBMISSION[email].find(
              (problem) => problem.problemId === req.query.problemId
            )
      )
    );
  }
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const token = req.cookies.token;
  const email = req.cookies.email;
  if (!token || token !== tokenRecord.get(email)) {
    res.status(401).send("Unauthorized!");
  } else {
    SUBMISSION[email].map((problem) => {
      if (problem.problemId === req.body.problemId)
        problem.codes = [...problem.codes, ...req.body.code];
    });
    res.send(JSON.stringify(SUBMISSION[email]));
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addQuestion", function (req, res) {
  const token = req.cookies.token;
  const email = req.cookies.email;
  if (
    !token ||
    token !== tokenRecord.get(email) ||
    !USERS.find((user) => user.email === email).isAdmin
  ) {
    res.status(401).send("Unauthorized!");
  } else {
    QUESTIONS.push(req.body);
    res.status(201).send(JSON.stringify(QUESTIONS));
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
