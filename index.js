const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [
  {
    title: "Max value in array",
    description: "Given an array, return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    title: "Sum of array",
    description: "Given an array, return the sum of all elements of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "15"
    }]
  },
  {
    title: "Min value in array",
    description: "Given an array, return the minimum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "1"
    }]
  }
];


const SUBMISSION = [
  {
    questionId: 1,
    userId: 1,
    code: "function maximum(arr) { return Math.max(...arr); }",
    status: "accepted"
  },
  {
    questionId: 1,
    userId: 2,
    code: "function maximum(arr) { return Math.min(...arr); }",
    status: "rejected"
  },
]

app.get('/', function(req, res) {
  res.send('WELCOME TO CODE WARS!')
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // Body should have email and password
  const email = req.body.email;
  const password = req.body.password;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    res.status(400).json({ error: 'User already exists' });
  } else {
    const newUser = { email: email, password: password, userId: USERS.length + 1 };
    USERS.push(newUser);
    res.status(200).json({ message: 'User registered successfully' });
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // Body should have email and password
  const email = req.body.email;
  const password = req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email && user.password === password);

  if (user) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = 'random-token-string'; // Replace with actual token generation logic
    res.status(200).json({ message: 'Login successful', token: token });
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).json({ error: 'Invalid email or password' });
  }
})

app.get('/questions', function(req, res) {
  // Return the user all the questions in the QUESTIONS array
  res.status(200).json({ questions: QUESTIONS });
})

app.get("/submissions", function(req, res) {
  // Return the users submissions for this problem
  const questionId = req.query.questionId;
  const userSubmissions = SUBMISSION.filter(submission => 
    submission.userId === req.user.id &&
    submission.questionId === questionId
  );
  res.status(200).json({ submissions: userSubmissions });
});

app.post("/submissions", function(req, res) {
  // Let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const userId = req.user.id; // Assuming user ID is stored in req.user object after authentication
  const questionId = req.body.problemId;
  const solution = req.body.solution;
  const isAccepted = Math.random() >= 0.5; // 50% chance of being accepted (Making it random for now)
  
  const submission = {
    questionId: questionId,
    userId: userId,
    code: solution,
    status: isAccepted
  };
  SUBMISSION.push(submission);
  if (isAccepted) {
    res.status(200).json({ message: 'Submission accepted' });
  } else {
    res.status(403).json({ error: 'Submission rejected' });
  }
});

// Leaving as hard todos
// Create a route that lets an admin add a new problem
// Ensure that only admins can do that.
const isAdmin = (req, res, next) => {
  // Add logic to check if the user is an admin
  // If the user is an admin, call next()
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next(); // User is an admin, proceed to the next middleware
  }
  // If the user is not an admin, return back 403 status code
  return res.status(401).json({ message: 'Unauthorized' });
}

app.post('/addproblems', isAdmin, (req, res) => {
  // Logic to add a new problem (Hardcoding the new question for now)
  const newProblem = {
    title: "Negative value in array",
    description: "Given an array, return the negative value of the array?",
    testCases: [{
        input: "[1,2,3,4,-5]",
        output: "-5"
    }]
  }
  QUESTIONS.push(newProblem);
  return res.status(201).json({ message: 'Problem added successfully' });
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})