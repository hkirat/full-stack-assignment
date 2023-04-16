const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const session = require('express-session')
const app = express()
const bcrypt = require('bcryptjs')
const port = 3001
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'))

const USERS = []
const QUESTIONS = [{
  questionId: 1,
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
    }
  ]
}]
const SUBMISSIONS = []
const secretKey = crypto.randomBytes(32).toString('hex')

app.use(express.json())
// app.use(bodyParser.json())

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}))

const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuth) {
    return next()
  } else {
    return res.redirect('/login')
  }
}

app.get('/login', function(req, res){
  res.send("Login to proceed");
})

app.post('/signup', async function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password, isAdmin} = req.body
  let isAdminValue = false
  if(isAdmin === "on"){
    isAdminValue = true
  }else{
    isAdminValue = false
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const hashedPassword = await bcrypt.hash(password, 7)
  const statusCode = addUser(email, hashedPassword, isAdminValue)
  // return back 200 status code to the client
  res.sendStatus(statusCode)
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const isCredientialsMatched = USERS.some(function(user) {
    if(user.email === email){
      const isMatched = bcrypt.compareSync(password, user.password)
      return isMatched
    }
  })
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if(isCredientialsMatched){
    req.session.currentUser = email
    req.session.isAuth = true
    const token = crypto.randomBytes(32).toString('hex')
    res.status(200).json({
      message: "Hello, Welcome",
      token: token
    })
  } else{
    return res.sendStatus(401)
  }
})

app.get('/questions', requireAuth, function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", requireAuth, function(req, res) {
  // return the users submissions for this problem
  const { questionId } = req.query
  const submission = SUBMISSIONS.filter(submission => submission.email === req.session.currentUser && submission.questionId === questionId)
  if(submission.length > 0){
    res.send(submission)
  }else{
    res.status(404).send("Not submitted before")
  }
  // res.send("Hello World from route 4!")
});

app.post("/submissions", requireAuth, function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  // console.log("Current User: " + req.session.currentUser)
  const { questionId, submission } = req.body
  // questionId will come from the form -> which is basically the question id of particular question, so ignoring the check for question Id presence in QUESTIONS array
  const randomlyAccept = Math.random() >= 0.5
  saveSubmission(req.session.currentUser, randomlyAccept, questionId, submission)
  res.send("Submission Submitted")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/addQuestion', requireAuth, function (req, res) {
  const question  = req.body; // Could use fetch, and call the /addQuestion route with method: POST on client side - javascript and send all data
  // Could dynamically add input fields for more than one testcases using JS
  // Get title, description and all testcases value of a question and make an object, structure could be similar to our QUESTIONS array 
  // Or Sending Raw data in the JSON format from Postman will work

  if(USERS.some(user => user.email === req.session.currentUser && user.isAdmin === true)){
    // console.log(req.session.currentUser)
  if(QUESTIONS.some(individualQuestion => individualQuestion.title === question.title)){
    return res.status(409).send("Seems like this question title already exists, please give different title")
  }else{
    addQuestion(question)
  }
  res.status(200).json({ message: 'Question Added successfully' })
  }else{
    res.status(401).json({ message: 'Only Admins can add a question' })
  }
})

app.get("/questions/:questionId", requireAuth, function(req, res){
  const questionId = req.params.questionId
  // console.log(typeof questionId);
  index = QUESTIONS.findIndex(question => question.questionId === parseInt(questionId))
  if(index !== -1 && index >= 0){
    res.send(QUESTIONS[index])
  }else{
    res.status(404).send("Question Not Available")
  }
})

app.post("/logout", requireAuth, function(req, res){
  req.session.isAuth = false
  req.session.destroy()
  res.redirect("/login")
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})


function addUser(email, password, isAdmin) {
  const userExists = USERS.some(function(user) {return user.email === email})
  if (userExists) {
    // console.log("User already exists")
    return 409
  } else {
    USERS.push({email, password, isAdmin})
    // console.log(USERS)
    return 200
  }
}

function saveSubmission(currentUser, randomlyAccept, questionId, submission,){
  // Find the existing submissions for the user and question
  const submissionID = 1
  const currentSubmission = {
    email: currentUser,
    questionId: questionId,
    submissions: [
      {
        submissionId: submissionID,
        submission: submission,
        isAccepted: randomlyAccept
      }
    ]
  }
  const index = SUBMISSIONS.findIndex(submission => submission.email === currentUser && submission.questionId === questionId);
  if (index !== -1 && index >= 0) {
    const newSubmissionId = SUBMISSIONS[index].submissions.length + 1
    const newSubmissionToAlreadySubmittedQuestion = { submissionId: newSubmissionId, submission: submission, isAccepted: randomlyAccept };
    SUBMISSIONS[index].submissions.push(newSubmissionToAlreadySubmittedQuestion);
  } else {
    SUBMISSIONS.push(currentSubmission);
  }
//  req.session.currentUser has the logged in user email, by using this we push the data into SUMBISSIONS Array with user email, question ID, submissionID
}

function addQuestion(question){
  // const usedQuestionIds = QUESTIONS.map(question => question.questionId)
  const newQuestionId = QUESTIONS.length + 1
  // or we can iterate the whole array and find the unused id
  // while(usedQuestionIds.includes(newQuestionId)){
  //   console.log("EXISTS");
  //   newQuestionId++
  // }
  question.questionId = newQuestionId
  QUESTIONS.push(question)
}