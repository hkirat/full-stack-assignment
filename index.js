const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const port = 3001

const USERS = [{
  email: "admin@admin.com",
  password: "admin123"
}]

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
 {
    email: 'admin@admin.com',
    title: 'Two states',
    code: 'tewst code',
    accepted: true
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email
  const password = req.body.password

  const userExists = USERS.find(user => user.email === email)
  if(userExists) {
    res.status(400).send("User already exist")
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({"email": email, "password": password})


  // return back 200 status code to the client
  res.status(200).send("User added")
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email
  const password = req.body.password

  const user = USERS.find(user => user.email === email)


  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if(!user || user.password !== password) {
    res.status(401).send("Invalid username or password")
    return
  }


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  res.json({
    "token": email + Math.random()
  })
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const email = req.query.email
  const questionTitle = req.query.title

  const submissions = SUBMISSION.filter(submission => submission.email == email && submission.title == questionTitle)

  res.json(submissions)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const email = req.body.email
  const title = req.body.title
  const code = req.body.code

  const userExist = USERS.find(user => user.email === email)
  const questionExist = QUESTIONS.find(question => question.title === title)

  if(!userExist || !questionExist) {
    res.status(400).send("User does not exist")
  }

  const accept = Math.random() > 0.5

  SUBMISSION.push({
    "email": email,
    "title": title,
    "code": code,
    "accepted": accept
  })

  res.status(200).send("Submitted")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/problems", function (req, res) {
  const email = req.body.email
  const title = req.body.title
  const description = req.body.description
  const testCases = req.body.testCases
  
  const isAdmin = email === 'admin@admin.com'

  // Check if the user is an admin
  if (!isAdmin) {
    return res.status(401).send('Only admins can add new problems');
  }

  QUESTIONS.push({title, description, testCases});

  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})