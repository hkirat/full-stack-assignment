const express = require('express')
const app = express()
const port = 3001

const USERS = [
  {
    email: "admin@example.com",
    password: "password",
    isAdmin: true
  },
  {
    email: "user@example.com",
    password: "password",
    isAdmin: false
  }
];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5"
      }
    ]
  },
  {
    title: "Find duplicates",
    description: "Given an array , return the duplicates in the array?",
    testCases: [
      {
        input: "[1,1,2,3,4,5]",
        output: "[1]"
      }
    ]
  }
];


const SUBMISSION = [];

 // Middleware function to check if user is an admin
function isAdmin(req, res, next) {
  const user = USERS.find(user => user.email === req.body.email);

  if (user && user.isAdmin) {
    // User is an admin, proceed to next middleware or route handler
    next();
  } else {
    // User is not an admin, send a 401 unauthorized response
    res.status(401).send('Unauthorized');
  }
}

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find(user => user.email === email);

  if (userExists) {
    // If user already exists, send a 400 error response to the client
    return res.status(400).send('User already exists');
  } else {
    // If user doesn't exist, add the new user to the USERS array
    USERS.push({ email, password });


  // return back 200 status code to the client
  return res.status(200).send('User created successfully');
}
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const user = USERS.find(user => user.email === email && user.password === password);

  if (user) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = Math.random().toString(36).substring(2);
    res.status(200).json({ message: 'Login successful', token });
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).json({ message: 'Login failed' });
  }
})

app.get('/questions', function(req, res) {
  // retrieve all questions from the QUESTIONS array
  const questions = QUESTIONS.map(question => question.text);

  // send the questions back to the client
  res.send(questions);
});


app.get("/submissions", function(req, res) {
  // retrieve user and problem id from query parameters
  const userId = req.query.user;
  const problemId = req.query.problem;

  // retrieve submissions for user and problem from SUBMISSIONS array
  const userSubmissions = SUBMISSION.filter(submission => submission.user === userId && submission.problem === problemId);

  // send the submissions back to the client
  res.send(userSubmissions);
});

app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  

  // retrieve user and problem id from the request body
  const { user, problem } = req.body;

  // randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // create a new submission object
  const submission = {
    user,
    problem,
    isAccepted,
    submissionTime: new Date(),
  };

  // add the submission to the SUBMISSION array
  SUBMISSION.push(submission);

  // send the submission response back to the client
  res.send(submission);
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', isAdmin, function(req, res) {
  // Add logic to decode body
  // body should have title, description, and testCases

  // Add new problem to QUESTIONS array
  const newProblem = {
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases
  };
  QUESTIONS.push(newProblem);

  // Return success response to client
  res.status(200).send('Problem added successfully');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});