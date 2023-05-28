const express = require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { auth } = require('./middleware');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const port = 3001

const USERS = [];
const JWT_SECRET = 'secret';
let USER_ID_COUNTER = 1;

const QUESTIONS = [
  {
    problemId: "1",
    title: "401. Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%",
    description:
      "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    exampleIn: "left = 5, right = 7",
    exampleOut: "4",
  },
  {
    problemId: "2",
    title: "205. Add two numbers",
    difficulty: "Medium",
    acceptance: "41%",
    description:
      "Given two numbers, add them and return them in integer range. use MOD=1e9+7",
    exampleIn: "a = 100 , b = 200",
    exampleOut: "300",
  },
  {
    problemId: "3",
    title: "202. Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: "Write an algorithm to determine if a number n is happy.",
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "4",
    title: "203. Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%",
    description: "Given number k , removed kth element",
    exampleIn: "list: 1->2->3 , k=2",
    exampleOut: "1->3",
  },
  {
    problemId: "5",
    title: "201. Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%",
    description:
      "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    exampleIn: "left = 5, right = 7",
    exampleOut: "4",
  },
  {
    problemId: "6",
    title: "205. Add two numbers",
    difficulty: "Medium",
    acceptance: "41%",
    description:
      "Given two numbers, add them and return them in integer range. use MOD=1e9+7",
    exampleIn: "a = 100 , b = 200",
    exampleOut: "300",
  },
  {
    problemId: "7",
    title: "202. Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: "Write an algorithm to determine if a number n is happy.",
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "8",
    title: "203. Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%",
    description: "Given number k , removed kth element",
    exampleIn: "list: 1->2->3 , k=2",
    exampleOut: "1->3",
  },
];


const SUBMISSION = [

]

app.post('/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userExists = USERS.find(user => {
    return user.email === email;
  })
  if (!userExists) {
    USERS.push({email, password, id: USER_ID_COUNTER++});
    return res.json({ msg: `User with email: ${email} created!` })
  }
  res.json(`User ${email} already exists!`)
})

app.post('/login', (req, res) => {
  let {email, password} = req.body;
  const userExists = USERS.find(user => {
    return user.email === email;
  })
  if (!userExists) {
    return res.status(403).json({msg: 'User Not Found'});
  }
  if (userExists.password !== password) {
    return res.status(403).json({msg: 'Incorrect Password.'});
  }
  const token = jwt.sign({
    id: userExists.id
  }, JWT_SECRET);

  res.status(200).json({
    token
  })
})

app.get('/me', auth, (req, res) => {
  const user = USERS.find(x => {
    return x.id === req.userId
  });
  return res.json({userId: user.id, email: user.email})
})

app.get('/questions', (req, res) => {
  const problemsArr = QUESTIONS.map(question=>{
    return {
      questionId: question.problemId,
      title: question.title,
      difficulty: question.difficulty,
      acceptance: question.acceptance
    }
  })
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({questions: problemsArr});
})

app.get('/question/:problemId', function(req, res) {
  const problemId = req.params.problemId;
  const problemsArr = QUESTIONS.find(question=>{
    return question.problemId === problemId
  })
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(problemsArr);
})

app.get("/submissions", auth, function(req, res) {
   // return the users submissions for this problem
  const { questionId } = req.query;
  const userId = req.userId;
  const submission = SUBMISSION.filter(subm =>{
    return subm.questionId == questionId && userId === subm.userId;
  });
  res.status(200).json({submissions: submission})
})


app.post("/submission", auth, (req, res) => {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  let {questionId, code} = req.body;
  const userId = req.userId;
  const submission = {
    userId: userId,
    questionId: questionId,
    code: code,
    status: ['AC', 'WA'][Math.floor(Math.random() * 2)]
  };
  SUBMISSION.push(
    submission
  );
  res.status(200).json({
    msg: submission.status
  })
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})