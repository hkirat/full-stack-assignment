const express = require('express')
const app = express()
const port = 3001

const USERS = [
  { email: 'admin@gmail.com', password: '123456', isAdmin: true },
  { email: 'doctor@gmail.com', password: '123456', isAdmin: false }
]

const QUESTIONS = [
  {
    title: 'Two states',
    description: 'Given an array , return the maximum of the array?',
    testCases: [
      {
        input: '[1,2,3,4,5]',
        output: '5'
      }
    ]
  }
]

const SUBMISSION = []

app.use(express.json())

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password, isAdmin = false } = req.body

  // Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExist = USERS.find(user => user.email === email)
  if (!userExist) {
    const newUser = { email: email, password: password, isAdmin: isAdmin }
    USERS.push(newUser)
  }

  // return back 200 status code to the client
  return res.status(200).json(USERS[-1])
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userExist = USERS.find(user => user.email === email)

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if (userExist.password === password) {
    return res
      .status(200)
      .json({ user: userExist, accessToken: Math.random() * 4 })
  } else {
    // If the password is not the same, return back 401 status code to the client
    return res.status(401).json({ message: 'Invalid credentials!' })
  }
})

app.get('/questions', function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.get('/submissions', function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSION)
})

app.post('/submissions', function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(req.body)
  res.status(200).json(SUBMISSION)
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/problem', function (req, res) {
  const { email, title, description, testCases } = req.body

  if (USERS[0].isAdmin) {
    QUESTIONS.push({
      title: title,
      description: description,
      testCases: testCases
    })
    return res.json({ message: 'Problem created successfully!' })
  } else {
    return res.json({ message: 'Error while creating problem!' })
  }
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})
