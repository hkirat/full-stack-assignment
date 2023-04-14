const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
app.use(express.json())

const port = 3001

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = [

]

//const helper function 

const hashPassword = async (passsword) => {
  try {
    const hashPassword = await bcrypt.hash(passsword, 10)
    return hashPassword;
  } catch (err) {
    console.log(err)
  }
}

const compareHashPassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword)
    return match
  } catch (err) {
    console.log(err);
  }
}

const generateToken = (email) => {
  try {
    const token = jwt.sign({ data: email }, process.env.SECRET)
    return token
  } catch (err) { console.log(err) }
}

const decodeToken = (token) => {
  try {
    const decode = jwt.verify(token, process.env.SECRET)
    return decode
  } catch (err) { console.log(err) }
}


//Middleware to varify token present is correct or not 
const varify = (req, res, next) => {
  //assuming header is send in the form of Brearer token
  const tokent = req.headers['Autherization'].split(" ")[1]
  const decodedToken = decodeToken(tokent);
  req.decodeToken = decodeToken
  next()
}


app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const hashedPassword = hashPassword(password)
  USERS.push({ email, hashedPassword })

  // return back 200 status code to the client
  res.sendStatus(200)
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userFound = USERS.find(user => user.email === email)
  const compare = compareHashPassword(password, hashPassword)
  if (compare) res.status(200).send("random string for auth")
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  else res.sendStatus(401)

})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSION)
});


app.post("/submissions", function (req, res) {
  const rand = Math.random() * 10
  // let the user submit a problem, randomly accept or reject the solution
  const { submition } = req.body;
  SUBMISSION.push(submition)
  if (rand > 5) res.status(200).json("accepted")
  else res.status(200).json("rejected")
  // Store the submission in the SUBMISSION array above

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/newproblem", varify, function (req, res) {
  const email = req.decodeToken
  const user = USERS.find(user => user.email === email)
  if (!user) res.sendStatus(403)
  else {
    const { question } = req.body
    QUESTIONS.push(question)
    res.status(201).json("question created")
  }
})


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})