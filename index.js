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

/*
  example entry
  {
    id: 1,
    questionId: 1,
    userEmail: 'user@example.com',
    answer: {},
  }
*/
const SUBMISSION = [

];

const isTokenValid = (jwtToken) => jwtToken.token === 'welcome';

const isAdmin = (role) => role === 'admin';

const findUser = (email) => {
  return USERS.find((user) => user.email === email);
}

const authMiddleware = (req, res, next) => {
  // Assuming token is being sent in the body of the request
  const jwtToken = req.body.jwtToken;
  if(isTokenValid(jwtToken)) {
    next();
  }
  else {
    res.statusCode(403);
    res.send('Unauthorized');
  }
}

const adminMiddleware = (req, res, next) => {
  const role = req.body.jwtToken.role;
  if(isAdmin(role)) {
    next();
  }
  else {
    res.send(403);
    res.send('Unauthorized. User must be an admin.')
  }
}

app.post('/signup', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const existingUser = findUser(email);
  if(!existingUser) {
    USERS.push({ email, password });
    res.statusCode(200);
    res.send('Sign up successful');
  }
  else {
    res.send('User already exists');
  }
});

app.post('/login', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const existingUser = findUser(email);
  const isValidUser = existingUser && existingUser.password === password;

  if(isValidUser) {
    res.statusCode(200);
    res.json({
      jwtToken: {
        token: 'welcome',
        role: 'user',
        userEmail: existingUser.email,
      }
    });
  }
  else {
    res.statusCode(401);
    res.send('Login failed');
  }
})

app.get('/questions', [authMiddleware], function(req, res) {
  res.statusCode(200);
  res.json(QUESTIONS);
})

app.get("/submissions", [authMiddleware], function(req, res) {
  const userEmail = req.body.jwtToken.userEmail;
  const userSubmissions = SUBMISSION.filter(item => item.userEmail === userEmail);
  res.statusCode(200);
  res.json(userSubmissions);
});


app.post("/submissions", [authMiddleware], function(req, res) {
  const userEmail = req.body.jwtToken.userEmail;
  const submissionPayload = req.body.submission;
  const isSubmissionValid = Math.round(Math.random()); // returns either 0 or 1
  if(isSubmissionValid) {
    const newUserSubmission = {
      id: 1,
      userEmail,
      questionId: submissionPayload.questionId,
      answer: submissionPayload.answer,
    }
    SUBMISSION.push(newUserSubmission);
    res.statusCode(200);
    res.send('Submission accepted');
  }
  else {
    res.statusCode(200);
    res.send('Submission not accepted');
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/questions", [authMiddleware, adminMiddleware], (req, res) => {
  const newQuestion = req.body.question;
  QUESTIONS.push(newQuestion);
  res.statusCode(200);
  res.send('Question added');
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})