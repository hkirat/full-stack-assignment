const express = require('express')
const app = express()
const port = 3000

const USERS = [];

const ADMIN_PASSWORD = "admin123"
app.use(express.json())

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
  {
    title: "Number of islands",
    description: "Given a 2d grid map of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    testCases: [{
      input: "[[1,1,1,1,0],[1,1,0,1,0],[1,1,0,0,0],[0,0,0,0,0]]",
      output: "1"
    }]
  },
  {
    title: "Longest palindromic substring",
    description: "Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.",
    testCases: [{
      input: "babad",
      output: "bab"
    }]
  }
];


const SUBMISSION = []

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).send("filed missing")
    return
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!USERS.some(user => user.email === email)) {
    USERS.push({ email, password })
    res.status(200).send("User added Succesfully!")
  } else {
    res.status(409).send("User already exists")
  }

  // return back 200 status code to the client
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).send("filed missing")
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (USERS.some(user => user.email === email && user.password === password)) {
    res.status(200).send("User logged in!")
    res.json({ token: "adjdgaedfaefqdfneigrkgwjgicnwc" })
    return
  }

  res.status(401).send("User or Password is incorrect")
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS)

})

app.get("/submissions", function (req, res) {
  
   // return the users submissions for this problem
  let { problem, email } = req.body
  if (!problem || !email) {
    res.status(400).send("filed missing")
    return
  }

  let submissions = SUBMISSION.filter(submission => submission.problem == problem && submission.email == email)
  res.status(200).send(submissions)

});


app.post("/submissions", function (req, res) {
  
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  let { problem, solution, email } = req.body
  if (!problem || !solution || !email) {
    res.status(400).send("filed missing")
    return
  }
  let accepted = Math.random() > 0.5 ? true : false
  const submission = { problem, solution, accepted, email}
  SUBMISSION.push(submission)

  res.status(201).send(submission)

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin/problems", function (req, res) {
  if (req.body.password !== ADMIN_PASSWORD) {
    res.status(401).send("Unauthorized")
    return
  }

  let { title, description, testCases } = req.body.problem
  if (!title || !description || !testCases) {
    res.status(400).send("filed missing")
    return
  }

  QUESTIONS.push({ title, description, testCases })
  res.status(201).send("Problem added successfully")
})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})