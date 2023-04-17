const express = require("express")

const app = express()
const port = 8000

const USERS = [
  { id: 1, name: "Alice", isAdmin: true },
  { id: 2, name: "Bob", isAdmin: false },
]

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
]

const SUBMISSION = []

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email
  const password = req.body.password

  const existingUser = USERS.find((user) => user.email === email)

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  if (existingUser) {
    return res.status(400).send("User with with given email already exists")
  }

  // return back 200 status code to the client
  const newUser = { email, password }
  USERS.push(newUser)

  res.send(200).send("User created Successfully")
})

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const email = req.body.email
  const password = req.body.password

  const existingUser = USERS.find(
    (user) => user.email === email && user.password === password
  )

  if (!existingUser) {
    return res.status(401).send("User not authorized")
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.status(200).send("User logged in successfully")
})

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const id = req.query.id
  const submissions = SUBMISSION.filter((submission) => submission.id === id)
  res.status(200).json(submissions)
})

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { id, title, description, testCase } = req.body
  const result = Math.random() < 0.5 ? "Accepted" : "Rejected"

  const newSubmission = {
    id: SUBMISSION.length + 1,
    title,
    description,
    testCase,
    status: result,
  }

  SUBMISSION.push(newSubmission)
  res.status(200).send(newSubmission)
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/problems", (req, res) => {
  const { userId, title, description, testCases } = req.body
  const user = USERS.find((user) => user.id === userId)
  if (!user || !user.isAdmin) {
    return res.status(401).send("User not authorized")
  }

  const question = { id: QUESTIONS.length + 1, title, description, testCases }
  QUESTIONS.push(question)
  res.status(201).json(question)
})

app.listen(port, function () {
  console.log(`app listening on port ${port}`)
})
