const express = require('express')
const app = express()
const port = 3001

const USERS = [{
  id: 1,
  username: "test1@gmail.com",
  password: "12345678",
  admin: true
}];

const QUESTIONS = [{
  id: 1,
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = [{
  userId: 1,
  questionId: 1,
  solution: "function max(arr){ return Math.max(...arr)}",
  isAccepted: true
},
]

app.use(express.json())

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  let { username, password, admin } = req.body
  if (!username || !password) {
    res.send(400).send({
      err: true,
      msg: "username & password are required"
    })
    return
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let isExistingUser = USERS.find(val => val.username === username)
  if (isExistingUser) {
    res.status(400).send({
      err: true,
      msg: "Account already in use"
    })
  }

  let newId = USERS.length + 1
  const newUser = { id: newId, username, password, admin: admin || false }
  USERS.push(newUser)



  // return back 200 status code to the client
  res.status(200).send({
    msg: "Account Created"
  })
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  let { username, password } = req.body
  if (!username || !password) {
    res.send(400).send({
      err: true,
      msg: "invalid username or password"
    })
  }
  let SOME_RANDOM_STRING = "SOME_RANDOM_STRING"

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let isUsernamePasswordValid = USERS.find(val => val.username === username && val.password === password)
  // If the password is not the same, return back 401 status code to the client
  if (!isUsernamePasswordValid) {
    res.status(400).send({
      err: true,
      msg: "invalid username or password"
    })
    return
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  res.header('Authorization', `Bearer ${SOME_RANDOM_STRING}`);
  res.status(200).send({
    msg: "Login Successful",
    token: SOME_RANDOM_STRING
  })
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  //return the users submissions for this problem
  SUBMISSION.filter(val => val.userId === req.user.id && val.questionId === req.query.questionId)
  res.status(200).send(SUBMISSION)
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  let { questionId, solution } = req.body
  let randomTest = Math.random() > 0.5 ? true : false
  let newId = SUBMISSION.length + 1
  const newSubmission = { id: newId, userId: req.user.id, questionId, solution, isAccepted: randomTest }

  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(newSubmission)
  res.status(200).send({
    msg: "Submission Created"
  })
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/questions", function (req, res) {
  // let the admin add a new problem
  let { title, description, testCases } = req.body
  let newId = QUESTIONS.length + 1
  const newQuestion = { id: newId, title, description, testCases }
  QUESTIONS.push(newQuestion)
  res.status(200).send({
    msg: "Question Created"
  })
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})