const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Decode the request body
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const existingUser = USERS.find(user => user.email === email);

  if (existingUser) {
    // If the user already exists, send a 400 status code to the client with an error message
    res.status(400).send('User already exists');
  } else {
    // If the user doesn't exist, add the new user to the USERS array
    USERS.push({ email, password });

    // Send a 200 status code to the client
    res.status(200).send('User registered successfully');
  }
});

app.post('/login', function(req, res) {
  // Decode the request body
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  if (!user) {
    // If the user doesn't exist, send a 401 status code with an error message to the client
    res.status(401).send('Invalid credentials');
  } else if (user.password === password) {
    // If the user exists and the password is correct, send a 200 status code with a token to the client
    const token = 'any-random-string'; // Generate a random string as a token for now
    res.status(200).json({ token });
  } else {
    // If the user exists but the password is incorrect, send a 401 status code with an error message to the client
    res.status(401).send('Invalid credentials');
  }
});

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array to the client
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
   res.status(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
  // Generate a random acceptance status for the submission (for now)
  const acceptanceStatus = Math.random() < 0.5 ? "rejected" : "accepted";
  
  // Create a new submission object with the data from the request body and the generated acceptance status
  const newSubmission = {
    questionId: req.body.questionId,
    userId: req.body.userId,
    code: req.body.code,
    language: req.body.language,
    status: acceptanceStatus,
    timestamp: new Date().getTime()
  };
  
  // Store the new submission in the SUBMISSIONS array
  SUBMISSIONS.push(newSubmission);
  
  // Send back a response to the client with the acceptance status of the submission
  res.status(200).json({ status: acceptanceStatus });
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})