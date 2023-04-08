const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Add middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Use generateToken function to generate random token of string
const generateToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
};

const USERS = [
  {
    email: 'admin',
    password: 'adminpw',
    isAdmin: true,
  },
];

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

const SUBMISSION = [];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/signup', function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    return res.status(400).send('Missing email or password');
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // Check if user with given email already exists
  const user = USERS.find((user) => user.email === email);

  if (user) {
    return res.status(401).send('User already exists');
  }

  // Add new user to USERS array
  const newUser = { email, password };
  USERS.push(newUser);

  console.log(USERS);
  // return back 200 status code to the client
  res.status(200).send('User registered successfully');
});

app.post('/login', function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  if (!email || !password) {
    return res.status(400).send('Missing email or password');
  }
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }
  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  if (user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if (user.isAdmin) {
    res
      .status(200)
      .send({ message: 'Login successful as admin', token: generateToken() });
  } else {
    res
      .status(200)
      .send({ message: 'Login successful', token: generateToken() });
  }
});

app.get('/questions', function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
});

app.get('/submissions', function (req, res) {
  // return the users submissions for this problem
  res.send('Hello World from route 4!');
});

app.post('/submissions', function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send('Hello World from route 4!');
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
