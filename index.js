const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const USERS = [];

const QUESTIONS = [{
  question: "Two states", description: "Given an array, return the maximum of the array?",
  testCases: [{ input: "[1,2,3,4,5]", output: "5" }]
},
{
  question: "Sum of numbers",
  description: "Given two numbers, return their sum.",
  testCases: [
    {
      input: "1, 2",
      output: "3"
    }
  ]
},
{
  question: "Palindrome",
  description: "Given a string, determine if it is a palindrome.",
  testCases: [
    {
      input: "racecar",
      output: "true"
    },
    {
      input: "hello",
      output: "false"
    }
  ]
}
];

const SUBMISSION = []

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // Check if user already exists
  const existingUser = USERS.find(user => user.email === email);

  if (existingUser) {
    // Return 409 status code (Conflict) if user already exists
    return res.status(409).send('User already exists');
  }

  // Otherwise, add new user to USERS array
  USERS.push({ email, password });

  // Return back 200 status code to the client
  res.status(200).send('User created successfully');
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const existingUser = USERS.find(user => user.email === email);

  if (!existingUser) {
    // If the user does not exist, return a 401 status code (Unauthorized)
    return res.status(401).send('Invalid email or password');
  }

  // Ensure that the password is the same
  if (existingUser.password !== password) {
    // If the password is not the same, return a 401 status code (Unauthorized)
    // If the password is not the same, return back 401 status code to the client
    return res.status(401).send('Invalid email or password');
  }

  // If the password is the same, generate a token and send it back to the client
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = 'This is a token ';
  res.status(200).json({ token });

  // Set a cookie in the response with the token
  res.cookie('token', token);


  // Return a 200 status code to the client
  res.status(200).send('Logged in successfully');

})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array

  res.status(200).json(QUESTIONS);

})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSIONS);
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const submission = req.body;
  const accepted = Math.random() < 0.5; // randomly accept or reject the solution
  submission.accepted = accepted;
  SUBMISSIONS.push(submission);
  res.status(200).json(submission);
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})