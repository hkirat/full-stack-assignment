const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json())

const port = 3001

const USERS = [{
  email: "test@gmail.com",
  password: "Test@123"
}];

const ADMINS = [];

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
app.get('/', (req, res) => {
  res.send('Hello')
})

app.post('/signup', (req, res) => {
  // Add logic to decode body
  // body should have email and password
  console.log(req.body)
  const { email, password } = req.body


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let exists = USERS.find(user => user.email === email)
  if (exists) return res.status(400).json({ msg: "User already exists" })

  USERS.push({
    email, password
  })

  // return back 200 status code to the client
  res.send('Welcome')
})

app.post('/login', function (req, res) {

  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  // Check if the user with the given email exists in the USERS array
  let user = USERS.find(user => user.email === email)

  if (user) {
    console.log("USER", user)
    // Also ensure that the password is the same
    if (user.password !== password)
      // If the password is not the same, return back 401 status code to the client
      res.status(401).json({ msg: 'Please enter correct password' })
    else {
      // If the password is the same, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      const authToken = "authToken"
      res.status(200).json({ authToken })
    }
  }
  else {
    res.status(400).json({ msg: 'User does not exist' })
  }

})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json({ QUESTIONS })
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.json({ SUBMISSION })
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { code } = req.body
  if (!Math.round(Math.random())) {
    return res.status(400).json({ msg: "Solution rejected" })
  }
  SUBMISSION.push({ code })
  res.status(200).send("Solution accepted")

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/add-problem', function (req, res) {

  const { email, problem } = req.body
  const isAdmin = ADMINS.find(admin => admin.email === email)

  if (!isAdmin) {
    return res.status(400).json({ msg: "Only Admins can add a problem" })
  }

  QUESTIONS.push(problem)
  res.status(200).send('Problem added successfully')

})

console.log(ADMINS, USERS, SUBMISSION, QUESTIONS)

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})