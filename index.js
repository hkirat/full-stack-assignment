const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000
const { auth } = require('./middleware')
const JWT_SECRET = "secret";


app.use(express.urlencoded({extended: true}));
app.use(express.static('public')) // For serving static files from public directory
app.use(express.json()); // For parsing application/json

let USER_ID_COUNTER = 3;
const USERS = [{
  id : "1",
  username: "james",
  email: "james@email.com",
  password: "james@100",
  role : "user"
},
{
  id : "2",
  username: "john",
  email: "johndoe@email.com",
  password: "john@100",
  role : "admin"
}];

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

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log(USERS);
})

app.post('/signup', (req, res) => {
  const {username, email, password} = req.body;

  if(!username || !email || !password) {
    return res.status(401).json({ message : 'Enter all the credentials'});
  }

  const existingUser = USERS.find(user => user.email === email);

  if(existingUser){
    return res.status(403).json({ message : 'User already exists with given email'});
  }

  USERS.push({ id : `${USER_ID_COUNTER++}`, username, email, password, role : "user" });
  console.log(USERS);
  return res.status(200).json({ message : 'User created successfully'});
})

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  
  if(!email || !password) {
    return res.status(401).json({message : 'Enter all the credentials'});
  }
  
  const user = USERS.find(user => user.email === email);
  
  if(!user){
    return res.status(401).json({ message : 'User not found'});
  }
  
  if(user.password !== password) {
    return res.status(403).json({ message : 'Check the password'});
  }else {
    const token = jwt.sign({
      id : user.id,
    }, JWT_SECRET);
    return res.status(200).json({ message : 'Welcome back!', token});
  }
})

app.get('/me', auth, (req, res) => {
  const user = USERS.find(user => user.id === req.userId);
  res.json({ user });
})

app.get('/question/:id', (req, res) =>{
  const id = req.params.id;

  const question = QUESTIONS.find(question => question.problemId === id);
  if(!question) {
    return res.status(411).json({});
  } else {
    return res.json({ question })
  }
});

app.get('/questions', (req, res) => {
  const filteredQuestions = QUESTIONS.map(question => ({
  problemId : question.problemId,
  difficulty : question.difficulty,
  acceptance : question.acceptance,
  title : question.title
  }));
  
  res.json({
    questions : filteredQuestions
  })
});

app.get('/submission/:problemId', auth, (req, res) => {
  const problemId = req.params.problemId;

  const submission = SUBMISSION.filter(x => x.problemId === problemId && x.userId === req.userId);
  res.json({ submission });
})

app.post("/submissions", auth, (req, res) => {
   const answer = Math.floor(Math.random()*2) > 0;
   const problemId = req.body.problemId;
   const submission = req.body.submission;

   if(answer) {
    SUBMISSION.push({
      submission,
      problemId,
      userId : req.params.userId,
      status : "AC"
    });
    return res.json({
      status : "AC"
    })
   } else {
    SUBMISSION.push({
      submission,
      problemId,
      userId : req.params.userId,
      status : "WA"
    });
    return res.json({
      status : "WA"
    })
   }
});

app.post('/admin', (req, res) => {
  const { question } = req.body.question;

  QUESTIONS.push(question);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
