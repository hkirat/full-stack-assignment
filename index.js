const express = require('express')
const app = express()
const port = 3001

app.use(express.json())
036663
const USERS = []

const QUESTIONS = [
  {
    title: 'Two states',
    description: 'Given an array , return the maximum of the array?',
    testCases: [
      {
        input: '[1,2,3,4,5]',
        output: '5',
      },
    ],
  },
  {
    title: 'Two sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    testCases: [
      {
        input: '[[2,7,11,15], target = 9',
        output: '[0,1]',
      },
    ],
  },
  {
    title: 'Binary Search',
    description:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    testCases: [
      {
        input: '[[-1,0,3,5,9,12], target = 9',
        output: '4',
      },
    ],
  },
]

const SUBMISSION = []

// generating a random token
const generateToken = (length) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    token += characters.charAt(randomIndex)
  }

  return token
}

// signup route
app.post('/signup', async (req, res) => {
  // Add logic to decode body
  // body should have email and password

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: 'email and password are required' })
    }

    const exixtingUser = USERS.find((user) => {
      return email === user.email
    })

    if (exixtingUser) {
      return res.status(409).json({ message: 'Email already exist' })
    }

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

    USERS.push(req.body)

    // return back 200 status code to the client
    res.status(200).json({ message: 'Sign up successfull' })
  } catch (error) {
    console.log(error)
  }
})

// login route
app.post('/login', async (req, res) => {
  // Add logic to decode body
  // body should have email and password

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: 'email and password are required' })
    }

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    const user = USERS.find((user) => {
      return email === user.email
    })

    if (user && password === user.password) {
      const token = generateToken(16)
      return res
        .status(200)
        .json({ message: 'Login successfull', token: token })
    }

    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    else {
      return res.status(401).json({ message: 'invalid credentials' })
    }
    // res.send('Hello World from route 2!')
  } catch (error) {
    console.log(error)
  }
})

app.get('/questions', async (req, res) => {
  //return the user all the questions in the QUESTIONS array

  try {
    res.status(200).json({ Questions: QUESTIONS })
  } catch (error) {
    console.log(error)
  }
})

app.get('/submissions', function (req, res) {
  // return the users submissions for this problem
  try {
    res.status(200).json({ submissions: SUBMISSION })
  } catch (error) {
    console.log()
  }
})

app.post('/submissions', function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const correctAnswer = Math.random() > 0.5
  const problemId = req.body.problemId
  const submission = req.body.submission
  const email = req.body.email
  if (correctAnswer) {
    SUBMISSION.push({
      submission,
      problemId,
      userId: email,
      status: 'AC',
    })

    return res.json({ status: 'AC' })
  } else {
    SUBMISSION.push({
      submission,
      problemId,
      userId: email,
      status: 'WA',
    })

    return res.json({ status: 'WA' })
  }
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/questions', async (req, res) => {
  const { username, password, question } = req.body

  if (!username || !password) {
    return res
      .status(401)
      .json({ message: 'username and password are required' })
  }

  if (username === 'admin' && password === 'adminpassword') {
    QUESTIONS.push(question)

    return res.status(200).json({ message: 'Question added successfully' })
  }

  // else unauthorized access

  res.status(403).json({ message: 'Unauthorized' })
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})
