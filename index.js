const express = require("express");
const app = express();
const port = 3001;

const USERS = [];
let schema = true;
const adminID = [];
[adminID(100).keys()].map((i) => i + 1);
console.log(adminID);

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

//
app.use(express.json());

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client

  const { email, password } = req.body;

  const isAlreadyUser = USERS.find((userEmail) => userEmail === email);
  if (isAlreadyUser) {
    return res
      .status(409)
      .json({ message: "Email already exists in database", user: NULL });
  } else {
    const userData = { email, password };

    USERS.push(userData);

    return res.status(200).json({ message: "Signup Success", user: userData });
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

  const isUSer = USERS.find((user) => user.email === email);
  if (!isUSer || isUSer.password !== password) {
    return res.status(401).json({ message: "Auth failed", token: NULL });
  } else {
    const token = "random token";
    return res.status(200).json({ message: "Auth success", token });
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array

  const questionData = {
    questions: QUESTIONS,
  };

  return res.status(200).json(questionData);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem

  const ID = req.headers["ID"];

  const userSubmissions = SUBMISSION.reduce((acc, sub) => {
    if (sub.ID === ID) {
      acc.push(sub);
    }

    return acc;
  }, []);

  if (!userSubmissions) {
    return res.status(404).json({ message: "no subs" });
  } else {
    const submissionsOfUSer = {
      submissions: userSubmissions,
    };

    res.status(200).json(submissionsOfUSer);
  }
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const ID = req.headers["ID"];
  const sub = req.body;
  sub.ID = ID;
  const accepted = MAth.random() < 0.5;
  sub.accepted = accepted;
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/createNew", function (req, res) {
  //expecting user is logged in

  const { role, problem } = req.body;
  if (adminID.includes(Number(role))) {
    //validating schema, here not using actual schema of mongo, but we would need to see schema validation.
    if (schema) {
      QUESTIONS.push(problem);
    } else {
      return res.status(400).json({ message: "schema failed" });
    }

    return res.status(200).json({ message: "Success" });
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
