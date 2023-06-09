// HTTP server, just need to call a few functions to make HTTP server
const express = require("express")
const app = express()
const port = 3000

// Convert all the data coming (from the user), to JSON format, before reaching to the endpoint
app.use(express.json())

// DUMMY DATA
const USERS = [
  {
    email: "u1@gmail.com",
    password: "12333",
  },
  {
    email: "u2@gmail.com",
    password: "12344",
  },
]

const QUESTIONS = [
  {
    id: 1,
    title: "Two States",
    description: "Lorem Ipsum .........",
  },
  {
    id: 2,
    title: "Count Islands",
    description: "Lorem Ipsum .........",
  },
]

const SUBMIT = [
  {
    title: "Two States",
    code: "Lorem Ipsum .........",
  },
  {
    title: "Two States",
    code: "Lorem Ipsum .........",
  },
  {
    title: "Two States",
    code: "Lorem Ipsum .........",
  },
]

// ___ENDPOINTS___

// Login
app.post("/login", (req, res) => {
  const {email, password} = req.body

  if (!email || !password) {
    return res.status(404)
  }

  const existingUser = USERS.find((user) => user.email === email)

  if (!existingUser) {
    res.send("Type correct email")
  } else {
    if (existingUser.password === password) {
      res.status(200).send("Logged in")
    } else {
      res.status(401).send("Type correct password")
    }
  }

  res.send("Login")
})

// Signup
app.post("/signup", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const existingUser = USERS.find((user) => user.email === email)

  if (existingUser) {
    return res.send("/login")
  } else {
    const newUser = {
      email,
      password,
    }

    USERS.push(newUser)
    res.status(200).send("Signed up and logged in successfully")
  }

  res.send("HELLO")
})

// Questions
app.post("/questions", (req, res) => {
  const {title, description} = req.body

  const existingQuestion = QUESTIONS.find((q) => q.title === title)

  if (!existingQuestion) {
    const newQuestion = {
      id: QUESTIONS.length + 1,
      title,
      description,
    }

    QUESTIONS.push(newQuestion)
    res.status(200).send("Question added successfully")
  } else {
    res.status(404).send("Question already exists, enter new question")
  }

  res.send("")
})

// Submissions
app.get("/submissions/:title", (req, res) => {
  const {title} = req.params
  const existingSubmissions = SUBMIT.filter((s) => s.title === title)

  if (!existingSubmissions) {
    res.status(404).send("No submissions for this problem")
  } else {
    res.status(200).json(existingSubmissions)
  }
  res.send("")
})

// Submit
app.post("/submit", (req, res) => {
  const {email, title, code} = req.body
  const existingUser = USERS.filter((u) => u.email === email)

  if (!existingUser) {
    res.send("/signup")
  } else {
    const newSubmit = {
      email,
      title,
      code,
    }
    SUBMIT.push(newSubmit)
    res.status(200).send("Solution submitted")
  }

  res.send("")
})

// ___DEMO ENDPOINTS___

app.get("/", (req, res) => {
  res.send("HOME PAGE")
})

app.get("/route1", (req, res) => {
  res.send("Hello World from route1")
})

app.get("/route2", (req, res) => {
  res.send("Hello World from route2")
})

app.get("/page", (req, res) => {
  res.send('<html><body><h1 style="color : red">Hello world from HTML page</h1></body></html>')
})

// JSON is sent, no HTML or anything
app.get("/json", (req, res) => {
  res.json({
    name: "John Wick",
    age: "50",
  })
})

// For activating the backend
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
