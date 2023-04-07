const express = require('express')
const app = express()
const port = 3000;

const bodyParser = require('body-parser')
app.use(bodyParser.json());


const USERS = [
  {
    name: "Kavish",
    email: "kavishshah30@gmail.com",
    role: 0,
    password: "kavish",
  },
  {
    name: "admin",
    email: "admin@gmail.com",
    role: 1,
    password: "admin",
  }
];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
    }]
  },
  {
    title: "Minimum of an array",
    description: "Given an array , return the minimum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "1"
    }]
  },
];

const SUBMISSION = [
  {
    question: "Two states",
    solution: "function twoStates(arr){return Math.max(...arr)}",
    isCorrect: true
  }
]

//SIGNUP
app.post('/signup', function (req, res) {
  const { email, password, isAdmin } = req.body;

  if (!email || !password) {
    res.status(400).send("Email or password is incorrect");
    return;
  }

  const role = isAdmin ? 1 : 0;
  const existingUser = USERS.find(user => user.email === email);

  if (existingUser) {
    res.status(400).send("User already exists");
    return;
  }

  USERS.push({ email, password, role });

  res.status(200).send('User created successfully')
})

//LOGIN
app.post('/login', function (req, res) {

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Email or password is missing");
    return;
  }

  const existingUser = USERS.find(user => user.email === email);

  if (!existingUser) {
    res.status(401).send("User does not exist");
    return;
  }

  if (existingUser.password !== password) {
    res.status(401).send("Password is incorrect");
    return;
  }

  const token = Math.random().toString(36).substring(5);

  res.status(200).json({ message: 'User logged in successfully', token })
})

//QUESTIONS
app.get('/questions', function (req, res) {
  res.status(200).json({ message: 'Success', questions: QUESTIONS })
})

//SUBMISSIONS
app.get("/submissions", function (req, res) {
  const { question } = req.body

  if (!question) {
    res.status(400).send("Question is missing");
    return;
  }

  const submissions = SUBMISSION.filter(sub => sub.question == question);

  if (!submissions) {
    res.status(400).send("No submissions found for this question")
    return;
  }

  res.status(200).json({ message: 'Success', submissions })
});

//SUBMISSIONS
app.post("/submissions", function (req, res) {

  const { question, solution } = req.body

  if (!question || !solution) {
    res.status(400).send("Question or solution is missing");
    return;
  }

  const isCorrect = Math.random() > 0.5;
  SUBMISSION.push({ question, solution, isCorrect });
  res.status(200).json({ message: `Solutions is ${isCorrect}` })
});

const isAdminCheck = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Email or password is missing");
    return;
  }

  const existingUser = USERS.find(user => user.email === email && user.password === password);

  if (!existingUser) {
    res.status(401).send("User does not exist");
    return;
  }

  if (existingUser.role == 0) {
    res.status(401).send("User is not an admin");
    return;
  }

  next();
}

//QUESTIONS
app.post("/questions", isAdminCheck, (req, res) => {
  const { title, description, testCases } = req.body;

  if (!title || !description || !testCases) {
    res.status(400).send("Title, description or test cases are missing");
    return;
  }

  QUESTIONS.push({ title, description, testCases });
  res.status(200).json({ message: 'Question added successfully' })

})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})