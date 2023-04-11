const express = require('express')
const app = express()
const port = 3001

//for parsing json
app.use(express.json())

const USERS = [

  {
    email: "admin@admin.com",
    password: "123",
    type: "admin"
  },

  {
    email: "abd@gmail.com",
    password: "456",
    type: "user"
  }
];

const QUESTIONS = [

  {
    questionID: 1,
    title: "Find Max",
    description: "Given an array, return the maximum of the array.",
    testCases: [
      {
        input: "[5,-16,34,97,0]",
        output: "97"
      },

      {
        input: "[675,-235,754,231,1007]",
        output: "1007"
      }
    ]
  },

  {
    questionID: 2,
    title: "Find Min",
    description: "Given an array, return the minimum of the array.",
    testCases: [
      {
        input: "[5,-16,34,97,0]",
        output: "-16"
      },

      {
        input: "[675,-235,754,231,1007]",
        output: "-235"
      }
    ]
  }
]

const SUBMISSIONS = [

  {
    user: "admin@admin.com",
    questionID: 1,
    code: "function findMax(arr) {return Math.max(...arr)}",
    status: "accepted"
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password, type} = req.body

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (USERS.find(user => user.email === email) === undefined) {
    
    //sign the user up by adding their details to the USERS array
    USERS.push({email: email, password: password, type: type})

    // return back 200 status code to the client
    res.status(200)
    res.send("User signup successful")
  }

  else {

    res.status(400)
    res.send("User already exists")
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const loginUser = USERS.find(user => user.email === email);

  if (loginUser === undefined) {

    res.status(400)
    res.send("User does not exist")
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  else if (loginUser.password === password) {

    //a random alphanumeric token of length 8
    const token = Math.random().toString(36).substring(2,10)

    res.status(200)
    res.json({token: token})
  }

  // If the password is not the same, return back 401 status code to the client
  else {

    res.status(401)
    res.send("Incorrect password")
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", function(req, res) {

  //request query params provide the user and the question id
  const {user, question} = req.query

  const userSubmissions = SUBMISSIONS.filter(sub => ((sub.user === user) && (sub.questionID.toString() === question)))

  // return the users submissions for this problem
  res.status(200)
  res.json(userSubmissions)
})

app.post("/submissions", function(req, res) {
  
  //let the user submit a problem, randomly accept or reject the solution
  const {user, questionID, code} = req.body

  //check if the question exists
  if (QUESTIONS.find(q => q.questionID === questionID) === undefined) {

    res.status(400)
    res.send("Question does not exist")
  }

  else {

    //status for acception or rejection
    const statusBool = (Math.random() < 0.5)
    const status = statusBool ? "accepted" : "rejected"

    //Store the submission in the SUBMISSION array above
    SUBMISSIONS.push({user: user, questionID: questionID, code: code, status: status})

    res.status(200)
    res.send("Submission successfully added")
  }
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/questions", function(req, res) {

  const {email, title, description, testCases} = req.body

  const questionID = QUESTIONS.length + 1

  const thisUser = USERS.find(user => user.email === email)

  if (thisUser.type === "admin") {

    QUESTIONS.push({questionID: questionID, title: title, description: description, testCases: testCases})
    res.status(200)
    res.send("Question successfully added")
  }

  else {

    res.status(401)
    res.send("Only admins are authorized to add a question")
  }
})

app.listen(port, function() {
  console.log(`NotExactlyLeetCode's backend is listening on port ${port}`)
})