const express = require('express')
const bodyParser= require('body-parser')
const app = express()
// https://stackabuse.com/get-http-post-body-in-express-js/
app.use(bodyParser.json({extended: true}))
const port = 3000

const USERS = [
  {
    userId: 1,
    email: "deezNuts@lick.com",
    password: "!337c0dE",
    isAdmin: false
  },
  {
    userId: 2,
    email:"eazyPeazei@mail.com",
    password: ":)12345^&*(q",
    isAdmin: false
  },
  {
    userId: 3,
    email:"admin@code.com",
    password: "1234567890",
    isAdmin: true
  }
];

const QUESTIONS = [
  {
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    status: "IN PROGRESS",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5"
      }
    ]
  },
  {
    id: 2,
    title: "Most Frequent Character",
    description: "Given a string, return the most frequent character from the string",
    status: "COMPLETED",
    testCases: [
      {
        input: "java developer",
        output: "e"
      }, 
      {
        input: "",
        output:""
      }
    ]
  },
  {
    id :3,
    title:"Given an array, return the greatest prime number from the array elements. If no prime number exists return -1",
    status: null,
    testCases: [
      {
        input: "[1, 2, 3, 4]",
        output: "3",
      },
      { 
        input: "[4]",
        output: "-1"
      }
    ]
  }
];


const SUBMISSION = [
  {
    "questionId": 1,
    "submissionId": 1,
    "testCasesPassed": 10,
    "totalTestCases": 10,
    "errorMessage": null
  },
  {
    "questionId": 2,
    "submissionId": 1,
    "testCasesPassed": 0,
    "totalTestCases": 10,
    "errorMessage":"Uncaught ReferenceError: str is not defined at <anonymous>:1:32 at Array.forEach (<anonymous>) at <anonymous>:1:11"
  },
  {
    "questionId": 2,
    "submissionId": 2,
    "testCasesPassed": 10,
    "totalTestCases": 10,
    "errorMessage": null
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const reqBody = req.body
  if (Object.keys(reqBody).length === 2 && reqBody.email && reqBody.password) {
    const existingUsers = USERS.filter(user => user.email === reqBody.email)
    if (existingUsers.length === 0) {

      const newUserId = Math.max.apply(Math, USERS.map(user => user.userId)) + 1
      const newUser = {
        email: reqBody.email,
        password: reqBody.password,
        userId: newUserId
      }

      USERS.push(newUser)
      res.status(200)
      res.send('New user added')
      return;
    }

    res.status(200)
    res.send('Email id already exists')
    return;
  }

  // return back 200 status code to the client
  res.status(500)
  res.send('Error in server')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const reqBody = req.body
  if (Object.keys(reqBody).length === 2 && reqBody.email && reqBody.password) {
    const existingUsers = USERS.filter(user => user.email === reqBody.email)
    if (existingUsers.length > 0) {
      const correctUser = existingUsers.filter(user => user.password === reqBody.password)
      if (correctUser.length === 1) {
        token = makeToken(40)

        const userToken = {token: token}
        correctUser[0].token = token
  
        res.status(200)
        res.send(userToken)

        USERS.map(u => u.userId != correctUser[0].userId ? u : correctUser[0])

        return;
      }

      res.status(401)
      res.send('Password does not match')
      return;
    }

    res.send('User does not exist. Please register first.')
  }
  res.status(500)
  res.send('Error from server')
})

function makeToken(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get('/questions/:questionId', (req, res) => {
  res.send(QUESTIONS.filter(q => q.id == req.params.questionId))
})

app.get("/submissions/:questionId", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION.filter(s => s.questionId == req.params.questionId).sort((a, b) => b.submissionId - a.submissionId))
});


app.post("/submissions/:questionId", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  let question = QUESTIONS.filter(q => q.id == req.params.questionId)
  if (question.length === 1) {
    question = question[0]

    let isPassed = Math.floor(Math.random() * 10) % 2 == 0
    question.status = isPassed ? "PASSED" : "IN PROGRESS"

    let newSubmissionId = SUBMISSION.filter(s => s.questionId == req.params.questionId).sort((a, b) => b.submissionId - a.submissionId)[0].submissionId + 1
    let totalCasesPassed = Math.floor(Math.random() * 10)
    let testCasesPassed = isPassed ? totalCasesPassed : 0
    let errorMessage = isPassed ? null : "Error"
    const newSubmission = {
      questionId: Number(req.params.questionId),
      submissionId: newSubmissionId,
      testCasesPassed: testCasesPassed,
      totalCasesPassed: totalCasesPassed,
      errorMessage: errorMessage
    }

    SUBMISSION.push(newSubmission)
  }
  res.send(SUBMISSION)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/questions', (req, res) => {
  const reqBody = req.body

  const loggedInUser = USERS.filter(user => user.token === reqBody.token)[0]

  if (!loggedInUser || !loggedInUser.isAdmin) {
    res.status(403)
    res.send('Only accessible to admin users')
    return;
  }
  
  const newQuestionId = Math.max.apply(Math, QUESTIONS.map(q => q.id)) + 1

  let newQuestion = {}
  newQuestion.questionId = newQuestionId
  newQuestion.title = reqBody.title
  newQuestion.testCases = reqBody.testCases


  QUESTIONS.push(newQuestion)

  res.send(QUESTIONS)
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})