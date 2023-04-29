import express from "express"
import bodyParser from "body-parser";
import * as Jwt from "jsonwebtoken";

const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: false }))

const USERS = [];
const SUBMISSION = []

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const isUserExists = (email) => {
  for (let user in USERS) {
    if (user.email === email) return true;
  }

  return false;
}

const isValidUser = (email) => {
  const userDetails = { _isExist: false, _password: null }

  for (let user in USERS) {
    if (user.email === email) {
      userDetails._isExist = true;
      userDetails._password = user.password
    }
  }

  return userDetails;
}

app.post('/signup', function(req, res) {
  const { email, password } = req.body()

  if (!isUserExists(email)) {
    USERS.push({ email, password })
    return res.status(200).send("User signed in!");
  } else {
    return res.status(409).send("User already exists.")
  }
})

app.post('/login', function(req, res) {
  const { email, password } = req.body
  const userDetails = isValidUser(email, password)

  if (userDetails._isExist === false) {
    return res.status(401).send("Email does not exist. Please register first.")
  }
  else if (userDetails._isExist && userDetails._password !== password) {
    return res.status(401).send("Incorrect password")
  }

  let token = Jwt.sign({ email }, "somesecretkey")
  res.cookie(token, "token")
  return res.status(200).send("successfully logged in.") 
})

app.get('/questions', function(req, res) {
  return res.send(QUESTIONS)
})

app.get("/submissions/:userId/:problemId", function(req, res) {
  const { userId, problemId } = req.params
  const submissions = SUBMISSION.filter((submission) => {
    return submission.userId === parseInt(userId) && submission.problemId === parseInt(problemId)
  })
  return res.status(200).json({ userSubmissions: submissions})
});


app.post("/submissions", function(req, res) {
   const { userId, problemId, code } = req.body
   const isAccepted = Math.random() > 0.5;

   const newSubmission = {
    userId,
    problemId,
    code,
    isAccepted
   }

   SUBMISSION.push(newSubmission)
  return res.status(200).json({ submission: newSubmission, isAccepted: isAccepted })
});

const isAdmin = (req, res, next) => {
  const { userType } = req.body

  if (userType === 'Admin') return next()
  return res.status(401).json({ message: "Unauthorized" })
}

app.post("/problems", isAdmin, (req, res) => {
  const { title, description, testCases } = req.body
  QUESTIONS.push({ title, description, testCases })
  return res.status(200).json({ message: "Successfully added" })
})

app.listen(port, isAdmin, function() {
  console.log(`Example app listening on port ${port}`)
})
