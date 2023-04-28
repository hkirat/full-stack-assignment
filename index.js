const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
const port = 3001;

const auth = require('./middleware');

const USERS = [{ email: 'samyakpiya@gmail.com', password: '123456789' }];

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
];

const SUBMISSIONS = [];

const emailExists = (email) => {
  for (let i = 0; i < USERS.length; i++) {
    return email === USERS[i].email;
  }
  return false;
};

app.get('/signup', (req, res) => {
  res.send(
    `
    <h1>Sign Up Form</h1>
    <form action='/signup' method='POST'>
      <input type='email' name='email' required />
      <input type='password' name='password' required/>
      <button type='submit'>Sign Up</button>
    </form>`
  );
});

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!emailExists(email)) return;

  USERS.push({ email, password });

  // return back 200 status code to the client
  res.sendStatus(200);
});

app.get('/login', (req, res) => {
  res.send(
    `
    <h1>Login Form</h1>
    <form action='/login' method='POST'>
      <input type='email' name='email' required />
      <input type='password' name='password' required/>
      <button type='submit'>Login</button>
    </form>`
  );
});

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  if (!emailExists(email)) return;
  console.log('email found');

  // Also ensure that the password is the same
  for (let i = 0; i < USERS.length; i++) {
    if (email !== USERS[i].email) {
      continue;
    }

    // If the password is not the same, return back 401 status code to the client
    if (password !== USERS[i].password) res.sendStatus(401);
    break;
  }

  // Store the token in the client-side storage (e.g., cookies or local storage)
  const token = jwt.sign({ email }, 'secret_key');
  res.cookie('token', token);
  res.status(200).json({ token });
});

app.use(auth);

app.get('/protected', (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.get('/questions', function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get('/submissions', function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSIONS);
});

app.post('/submissions', function (req, res) {
  // Let the user submit a problem, randomly accept or reject the solution
  const { email, problemId, solution } = req.body;
  const isAccepted = Math.random() < 0.5; // Randomly accept or reject the solution

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push({ email, problemId, solution, isAccepted });

  // Return a response to the user indicating whether their solution was accepted or rejected
  if (isAccepted) {
    res.send('Congratulations, your solution was accepted!');
  } else {
    res.send('Sorry, your solution was not accepted.');
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
