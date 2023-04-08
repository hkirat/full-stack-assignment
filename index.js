const express = require('express')
const bodyParser = require("body-parser")
const jsonWebToken = require("jsonwebtoken")
const { string, object, nativeEnum, array, any } = require("zod")
const { v4: uuidV4 } = require("uuid")
const app = express()
const port = 3001
const secretKey = "ThisIsASecretKey"

const USERS = [];

const QUESTIONS = [{
  questionId: 1,
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSION = [
  {
    userEmail: "mprasanth18@gmail.com",
    questionId: 1,
    submissionId: 1,
    attempt: 1,
    submissionStatus: "accepted",
    answer: `function getMax(arr) {
  if (arr.length === 0) {
    return null; // return null for empty arrays
  }

  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}
`
  }
]

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const ALLOWED_ROLES = ["user", "admin"];
const emailSchema = string().email()
const passwordSchema = string()
  .min(8, { message: "password must contain at least 8 characters" })
  .regex(/[A-Z]/, { message: "password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "password must contain at least one digit" })
  .regex(/[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\;\:\'\"\,\.\/\<\>\?]/, { message: "password must contain at least one special character" })
const rolesSchema = nativeEnum(ALLOWED_ROLES);

const signUpSchema = object({
  email: emailSchema,
  password: passwordSchema,
  role: rolesSchema
})

const loginSchema = object({
  email: emailSchema,
  password: passwordSchema
})

const testCaseSchema = object({
  input: any(),
  output: any()
})

const questionSchema = object({
  title: string(),
  description: string(),
  testCases: array(testCaseSchema)
})

app.get("/", (req, res) => {
  res.send("checking")
})

app.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  if (!email || !password || !role)
    return res.status(400).send({ status: false, message: "email, password and role are required" })

  const validationResult = signUpSchema.safeParse({ email, password, role })
  if (!validationResult.success)
    return res.status(400).json({ status: false, message: formatZodError(validationResult.error) })


  const userAlreadyExistsWithGivenEmail = USERS.find(user => user.email === email);
  if (userAlreadyExistsWithGivenEmail)
    return res.status(409).send({ status: false, message: "provided email address is already associated with an existing account" })

  USERS.push({ email, password, role })
  res.status(201).send({ status: true, message: "User successfully signed up", data: { user: { email, role } } })
})



app.post('/login', function (req, res) {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).send({ status: false, message: "email and password are required" })


  const validationResult = loginSchema.safeParse({ email, password })
  if (!validationResult.success)
    return res.status(401).send({ status: false, message: "invalid email or password" })

  const user = USERS.find(user => user.email === email && user.password === password)
  if (!user)
    return res.status(401).send({ status: false, message: "invalid email or password" })

  return res.status(200).send({ status: true, message: "successfully logged in", data: generateToken(user.email, user.role) })
})



app.get('/questions', authenticateToken, function (req, res) {
  return res.status(200).send({ status: true, message: `${QUESTIONS.length} question(s) found`, data: { questions: QUESTIONS } })
})

app.get("/submissions", authenticateToken, function (req, res) {
  const { questionId } = req.body
  const { user } = req;

  if (!questionId)
    return res.status(400).send({ status: false, message: "questionId is required" })

  const submissions = SUBMISSION.filter(submission => submission.questionId === questionId && submission.userEmail === user.email)
  if (submissions.length === 0)
    return res.status(404).send({ status: false, message: "no submission found for the given question id for this user" })


  res.status(200).send({ status: true, message: `${submissions.length} submission(s) found`, data: { submissions } })
});


app.post("/submissions", authenticateToken, function (req, res) {
  const { questionId, answer } = req.body;
  if (!questionId || !answer)
    return res.status(400).send({ status: false, message: "questionId and answer are required" })


  const submissionStatus = Math.random() < 0.5 ? "accepted" : "rejected";

  const { user } = req;

  const isValidQuestionId = QUESTIONS.find(question => question.questionId === questionId) != undefined
  if (!isValidQuestionId)
    return res.status(400).send({ status: false, message: "Invalid questionId passed" })


  const attemptNo = SUBMISSION.reduce((accumulator, submission) => {
    if (submission.questionId === questionId && submission.userEmail === user.email)
      accumulator++;
    return accumulator;
  }, 0) + 1;

  const newSubmission = {
    userEmail: user.email,
    questionId: questionId,
    submissionId: uuidV4(),
    attempt: attemptNo,
    submissionStatus: submissionStatus,
    answer: answer
  }

  SUBMISSION.push(newSubmission);

  if (submissionStatus === "accepted")
    res.status(201).send({ status: true, message: "solution accepted", data: { submission: newSubmission } })
  else
    res.status(201).send({ status: true, message: "solution rejected", data: { submission: newSubmission } })
});


app.post("/question", authenticateToken, function (req, res) {
  const { user } = req
  if (user.role != "admin")
    return res.status(401).json({ status: false, message: "only admins can add new problems" })

  const { title, description, testCases } = req.body

  if (!title || !description || !testCases)
    return res.status(400).json({ status: false, message: "title, description and testCases are required" })

  const validationResult = questionSchema.safeParse({ title, description, testCases })
  if (!validationResult.success)
    return res.status(400).json({ status: false, message: formatZodError(validationResult.error) })

  const newQuestion = {
    questionId: uuidV4(),
    title,
    description,
    testCases
  }
  QUESTIONS.push(newQuestion)

  return res.status(201).json({ status: true, message: "successfully added new question", data: { question: newQuestion } })
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})

function generateToken(email, role) {
  return { token: jsonWebToken.sign({ email, role }, secretKey, { expiresIn: '24h' }) }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token === null) {
    return res.status(401).send({ status: false, message: "token is required" })
  }

  jsonWebToken.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).send({ status: false, message: "invalid token" })
    }

    const actualUser = getUser(user.email)
    if (!actualUser) {
      return res.status(401).send({ status: false, message: "user doesn't exists" })
    }
    req.user = actualUser;
    next()
  })
}

function getUser(email) {
  return USERS.find(user => user.email === email)
}

function formatZodError(zodError) {
  return zodError.errors.map(error => error.message).join(", ")
}