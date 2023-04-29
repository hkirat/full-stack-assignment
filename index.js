import express from "express"
import session from "express-session"

const app = express()
const port = 3001

app.use(
  session({
    secret: "secret-lc",
    resave: false,
    saveUninitialized: true,
  })
)

const USERS = []

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
    title: "Palindrome",
    description: "Given a string , check if it is palindrome or not.",
    testCases: [
      {
        input: "abaaba",
        output: "Yes",
      },
    ],
  },

  {
    id: 3,
    title: "Fibonacci",
    description: "Given input n, return the nth fibonacci number.",
    testCases: [
      {
        input: "6",
        output: "8",
      },
    ],
  },
  {
    id: 4,
    title: "Longest palindromic subsequence",
    description:
      "Given a string , return the length longest palindromic subsequence.",
    testCases: [
      {
        input: "bbbab",
        output: "4",
      },
    ],
  },
]

const SUBMISSION = []
app.get("/", function (req, res) {
  if (req.session.email) res.send("Welcome to leetcode")
  else res.send("login to leetcode")
})

app.use(express.json())
app.post("/signup", function (req, res) {
  if (req.session.email) return res.status(400).send("Already logged in!")
  let credentials = req.body
  let email = credentials.email
  let password = credentials.password

  if (email && password) {
    let userExists = USERS.some((u) => u.email === email)
    if (userExists)
      return res.status(400).send("User with this email already exists!")
    USERS.push({ email, password })
    console.log(USERS)
    return res.status(200).send("User created successfully!")
  } else {
    if (!email) return res.status(400).send("Email missing!")
    if (!password) return res.status(400).send("Password missing")
  }
})

app.post("/login", function (req, res) {
  let credentials = req.body
  let email = credentials.email
  let password = credentials.password

  if (email && password) {
    let foundUser = USERS.find(
      (user) => user.email === email && user.password === password
    )
    if (foundUser) {
      req.session.email = email
      res.status(200).send(`Welcome ${email}, You are logged in!`)
    } else res.send(400).send("Incorrect email or password!")
  } else res.send(400).send("Email and password are required!")
})

app.get("/logout", function (req, res) {
  if (req.session.email) {
    req.session.destroy()
    res.redirect("/")
  } else res.status(401).send("You are not logged in!")
})

app.get("/questions", function (req, res) {
  if (!req.session.email)
    return res.status(401).send("You need to login to access.")
  console.log(QUESTIONS)
  res.send(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  if (!req.session.email)
    return res.status(401).send("You need to post solution.")

  let userSub = SUBMISSION.filter((sub) => sub.email === req.session.email)
  res.send(userSub)
})

app.post("/submissions", function (req, res) {
  if (!req.session.email)
    return res.status(401).send("You need to post solution.")

  let sub = req.body
  sub.email = req.session.email
  sub.accepted = generateRandBool()
  SUBMISSION.push(sub)
  console.log(SUBMISSION)

  console.log(sub)
  res.send("Submitted succesfully")
})

const generateRandBool = () => {
  return Math.random() < 0.5
}

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})
