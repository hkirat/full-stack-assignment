const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    qid: '1',
    title: 'Max in Array',
    description: 'Given an array , return the maximum of the array?',
    testCases: [
      {
        input: '[1,2,3,4,5]',
        output: '5',
      },
    ],
  },
];

const SUBMISSION = [];

// middleware
const auth = (req, res, next) => {
  const { email } = req.body;
  const userIndex = USERS.findIndex((user) => user.email === email);
  if (userIndex < 0)
    return res.status(401).send('Create a account or Login First...');
  if (!USERS[userIndex].isLoggedIn) {
    res.status(401).send('Login First');
  }
  next();
};

const isAdmin = (req, res, next) => {
  const { email } = req.body;
  if (USERS.find((user) => user.email === email).userType !== 'admin') {
    return res.status(401).send('Only Admin can add a new problem');
  }
  next();
};

app.use(bodyParser.json());

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password, userType } = req.body;
  if (USERS.find((user) => user.email === email)) {
    return res.status(201).json({ message: 'Email already exists.' });
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({
    email: email,
    password: password,
    userType: userType,
    isLoggedIn: false,
  });
  // return back 200 status code to the client
  res.send('User with email ' + email + ' has been created');
});

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (
    !USERS.find((user) => user.email === email && user.password === password)
  ) {
    return res
      .status(401)
      .json({ message: 'Either Email or Password is Incorrect.' });
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const userIndex = USERS.findIndex((user) => user.email === email);
  USERS[userIndex].isLoggedIn = true;
  res.status(200).json({ message: 'Succesfully logged in.' });
});

app.get('/questions', auth, function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ questions: QUESTIONS });
});

app.get('/submissions', auth, function (req, res) {
  // return the users submissions for this problem
  const { qid } = req.body;
  res
    .status(200)
    .json({ submissions: SUBMISSION.filter((s) => s.qid === qid) });
});

app.post('/submissions', auth, function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { qid, submission } = req.body;
  const question = QUESTIONS.find((question) => question.qid === qid);
  const submissionObj = {
    qid: qid,
    title: question.title,
    description: question.description,
    submissionCode: submission.code,
    acceptedorRejected: question.testCases.every((testCase) => {
      // API to call input , output validation with code
      // apiCall(testCase.input, testCase.output, submission.code);
      return true;
    }),
  };
  SUBMISSION.push(submissionObj);
  res.status(200).json({ msg: 'Solution Submitted successfully' });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.post('/addProblem', auth, isAdmin, (req, res) => {
  // ensure that only admins can do that.
  const { title, description, testCases } = req.body;
  const problem = {
    qid: QUESTIONS.length + 1,
    title,
    description,
    testCases,
  };
  QUESTIONS.push(problem);
  return res.status(200).json({ msg: 'New problem added successfully' });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
