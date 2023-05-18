const express = require('express')
const app = express()
const port = 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
},
{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}
];


const SUBMISSION = [

]

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and passwor
  console.log(req.body)
  if (!(req.body.email && req.body.password && req.body.role)) {
    res.send("Email or password or role not set")
    res.status(400)
  }
  else {
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    if (USERS.find((obj) => obj.email === req.body.email)) { res.send("User exsists") }
    else {

      USERS.push({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      })

      res.send("user saved succesfully")
      console.log(USERS)
    }
    // return back 200 status code to the client
    res.status(200)
  }
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  if (!(req.body.email && req.body.password)) {
    res.send("Email and password not sent")
    res.status(400)
  }
  else {
    if (!USERS.find((obj) => obj.email)) {
      res.send("Given email ID do not exsist")
      res.send(404)
    }
    else {
      const obj = USERS.find((obj) => { return obj.email === req.body.email })
      if (obj.password === req.body.password) {
        res.send("Logged in succesfully")
        res.status(200)
      }
      else {
        res.send("Incorrect password")
        res.status(401)
      }
    }
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function (req, res) {
  //return the user all the questions in the QUESTIONS array
  const quest = QUESTIONS.map((question) => {
    return question;
  })
  res.send(quest)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const submits = SUBMISSION.map((submission) => {
    return submission;
  })
  res.send(submits)
});


app.post("/submissions?", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const randomAcceptReject = Math.random() * 2
  if (randomAcceptReject === 0) {
    SUBMISSION.push({
      user: req.query.email,
      question: req.query.question_name,
      status: "accepted"
    })
  }
  else {
    SUBMISSION.push({
      user: req.query.email,
      question: req.query.question_name,
      status: "rejected"
    })
  }
  console.log(SUBMISSION)
  res.send("Solution submitted successfully")
  res.status(200)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/question", (req, res) => {
  if (!(req.body.email && req.body.title && req.body.description && req.body.testCases)) {
    res.send("email or title or description or testCase is missing")
    res.status(401)
  }
  else {
    const obj = USERS.find((obj) => { if (obj.email === req.body.email) return obj })
    if (obj.role === "admin") {
      QUESTIONS.push({
        title: req.body.title,
        description: req.body.desciption,
        testCases: req.body.testCase
      }
      )
      res.send("Question saved succesfully")
      res.send(200)
    }
    else {
      res.send("Only admin are allowed to access this page")
      res.status(400)
    }
  }
})


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})