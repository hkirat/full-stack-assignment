const express = require('express')
const app = express()
const port = 3001
app.use(express.json());

// Store user data 
const USERS = [];

// Collection of questions
const QUESTIONS = [
  // question 1
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
    }]
  },
  // question 2
  {
    title: "Two Numbers",
    description: "how to find prime number form array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "2,3,5"
    }]
  }
];

//  store submissions
const SUBMISSION = [];

// FUNCTION : Add a middleware to authenticate the user
function authenticate(req, res, next) {
  const token = req.header("x-auth-token");
  console.log(token)

  // Check if the token is present and valid
  if (!token || !isValidToken(token)) {
    return res.status(401).send("Access denied. Invalid token.");
  }

  next();
}

// FUNCTION : Generate a random token
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// FUNCTION : Check if the token is valid
function isValidToken(token) {
  // we'll write logic later here after the video
  return true;
}

// All routes
// *Important* Please Use Thunder Client or PostMan to send POST requests!
// 1. Home route
app.get('/', function (req, res) {
  res.status(200).send("Hello Friends! Please Contribute. ☕");
})

// 2. Signup route 
app.post('/signup', function (req, res) {

  // Get request from body (sended by user's browser)
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    return res.status(400).send("User already exists.");
  }

  // Add the user to the USERS array
  const token = generateToken();
  USERS.push({ email, password, token });

  // Return back 200 status code to the client
  res.status(200).send("User created successfully.");
})

// 3. login route
app.post('/login', function (req, res) {

  // Get request from body (sended by user's browser)
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  if (!user) {
    return res.status(401).send("Invalid Credentials.");
  }

  // Check if the password is correct
  if (user.password !== password) {
    return res.status(401).send("Invalid Credentials.");
  }

  // Generate a token and send it back to the client
  res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    token: user.token
  });
})

// 4. Get Questions
app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send({ QUESTIONS })
})

// 5. Get submissions
app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).send(SUBMISSION);
});

// 6. Post your submissions
app.post("/submissions", authenticate, function (req, res) {

  const submission = req.body;

  // Generate a random number to decide if the submission is accepted or rejected
  const randomNumber = Math.random();

  if (randomNumber > 0.5) {
    submission.status = "accepted";
  } else {
    submission.status = "rejected";
  }

  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(submission);

  res.status(200).send(submission);
});

// 7. Routes for admin to perfom CURD operation on question ARRAY

// ***current only harkirat bhaiya is admin only***
app.post("/questions", authenticate, function (req, res) {

  // Check if the user is an admin
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res.status(401).send("Unauthorized");
  }

  // Add new question to QUESTIONS array
  const newQuestion = req.body;
  QUESTIONS.push(newQuestion);

  res.status(200).send("Question added successfully");
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})