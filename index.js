const express = require("express");
const app = express();
const port = 3000;

const USERS = [];

const QUESTIONS = [
  {
    questionId: 1,
    title: "Max Number",
    description: "Given an array of integers find the largest number",
    testCases: [
      {
        input: `[2, 7, 11, 15]`,
        output: `15`,
      },
    ],
  },
  {
    questionId: 2,
    title: "Min Number",
    description: "Given an array of integers find the smallest number",
    testCases: [
      {
        input: `[2, 7, 11, 1]`,
        output: `1`,
      },
    ],
  },
  {
    questionId: 3,
    title: "Even Number",
    description: "Given an array of integers return even number",
    testCases: [
      {
        input: `[2, 7, 11, 1]`,
        output: `2`,
      },
    ],
  },
  {
    questionId: 4,
    title: "Odd Number",
    description: "Given an array of integers return odd number",
    testCases: [
      {
        input: `[2, 6, 11, 8]`,
        output: `11`,
      },
    ],
  },
];

const SUBMISSIONS = [
  {
    userId: 1,
    questionId: 1,
    code: `function(){}`,
    status: "accepted",
  },
  {
    userId: 1,
    questionId: 2,
    code: `function(){}`,
    status: "rejected",
  },
  {
    userId: 2,
    questionId: 2,
    code: `function(){}`,
    status: "rejected",
  },
];

//SIGNUP
app.post("/signup", (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password, role } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const existingUser = USERS.some((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Email Already Exists" });
  }

  //If new user
  const newUser = { email, password, role };
  USERS.push(newUser);

  // return back 200 status code to the client
  res.status(200).json({ message: "User Signup successful" }, newUser);
});

//LOGIN
app.post("/login", (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);

  if (!user) {
    res.status(400).json({ error: `Email doesn't exists` });
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (user && user.password === password) {
    res.status(200).json({
      message: "User is successfuly logged in",
      token: "random-string",
    });
  } else {
    res.status(400).json({ error: "Invalid password" });
  }
});

//Get Questions
app.get("/questions", (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ QUESTIONS });
});

//Get users submissions
app.get("/submissions/:userId/:questionId", (req, res) => {
  // return the users submissions for this problem
  const { userId, questionId } = req.params;

  //Filter users submission
  const userSubmissions = SUBMISSIONS.filter(
    (submission) =>
      submission.userId === parseInt(userId) &&
      submission.questionId === parseInt(questionId)
  );

  //return the submissions
  res.status(200).json({ userSubmissions });
});

//Let user submit a solution
app.post("/submissions/:userId/:questionId", (req, res) => {
  // let the user submit a problem, randomly accept or reject the solution
  const { userId, questionId } = req.params;
  const { solution } = req.body;

  // let the user submit a problem, randomly accept or reject the solution
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  const problemStatus = "";
  if (randomNumber > 5) {
    problemStatus = "accepted";
  } else {
    problemStatus = "rejected";
  }
  // Store the submission in the SUBMISSION array above
  //Add submission to submissions array
  SUBMISSIONS.push({
    userId: parseInt(userId),
    questionId: parseInt(questionId),
    code: solution,
    status: problemStatus,
  });

  res.status(200).json({ message: "Submission successfully submitted" });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
//Add question (admin only)
app.post("/addQuestion", (req, res) => {
  const { role } = req.body;
  if (role !== "admin") {
    res.status(401).json({ error: "Unauthorize Access" });
  }

  const { title, description, testCases } = req.body;

  if (!title || !description || !testCases) {
    return res.status(400).send({ error: "Bad Request" });
  }

  const problem = {
    questionId: QUESTIONS.length + 1,
    title: title,
    description: description,
    testCases: testCases,
  };

  QUESTIONS.push(problem);

  res.status(200).json({ message: "Question Submitted Successfully" });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
