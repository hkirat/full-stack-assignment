const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))

const USERS = [];

const QUESTIONS = [{
  title: "Find maximum",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
},
{
  title: "Find minimum",
  description: "GIven an array, return the minimum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "1"
  },
  {
    input: "[3,4,5,6,7]",
    output: "3"
  }]
}];


const SUBMISSION = [
]


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});
app.post('/signup', async (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }
  USERS.push({ email, password });

  // return back 200 status code to the client
  res.status(200).json({ message: 'User created successfully' });
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});
app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  if (user.password !== password) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = 'randomToken';
  res.status(200).json({ message: 'Login sucessful', token })
})

app.get('/questions', (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.render('questions', { questions: QUESTIONS });
});
app.get('/questions/:id', (req, res) => {
  // var question = QUESTIONS[req.params.id];
  res.render('individualQns', { qns: QUESTIONS[req.params.id], qnsId: req.params.id });
});

app.get("/submissions/:id", (req, res) => {
  // return the users submissions for this problem
  res.render('submission',
    {
      qns: QUESTIONS,
      subs: SUBMISSION,
      target: req.params.id
    })
});
app.post("/submissions", (req, res) => {
  // let the user submit a problem, randomly accept or reject the solution
  const { solution, qnsIds } = req.body;
  const isAccepted = Math.random() < 0.5;
  const newSubmission = {
    qnsIds,
    solution,
    isAccepted
  };
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(newSubmission);
  if (!isAccepted) {
    res.send(`Submission is rejected`);
  }
  else {
    res.status(201).json({ message: 'submission is accepted', newSubmission });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})