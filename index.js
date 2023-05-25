const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //use body - parsers to get req.body

const USERS = [];

const SUBMISSION = []

const QUESTIONS = [
  {
    title: "1. Two states",
    acceptance: "52.4%",
    difficulty: "medium",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
  },
  {
    title: "2. Two Sum",
    acceptance: "49.9%",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
  }
]

app.post('/signup', function (req, res) {

  const { email = null, password = null } = req.body;
  if (!(email && password)) {
    throw new Error("Please Fill The Details")
  }

  if (!USERS.find(user => user.email === email)) {
    USERS.push({
      email,
      password
    })
  } else {
    throw new Error("User already exists Please Login")
  }

  res.status(201).send('User Created Successfully')

})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email = null, password = null } = req.body;
  if (!(email && password)) {
    throw new Error('Invalid email or password')
  }

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  // Also ensure that the password is the same
  if (user && user.password === password) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    res.status(201).json({ token: 'eyJhbGcPrzScxHb7SR6sAOMRckfFwi4rp7o' });
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).json({ error: 'Invalid email or password' });
  }
})

app.get('/questions', function (req, res) {
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  res.status(200).json(SUBMISSION)
});


app.post("/submissions", function (req, res) {
  const submissions = req.body;
  const accepted = Math.random() < 0.5;

  submissions.accepted = accepted;
  SUBMISSION.push(submissions);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})