const express = require('express');
const app = express();
const port = 3001;

const USERS = [
  { email: 'dummyuser1@gmail.com', password: 'password1' },
  { email: 'dummyuser2@gmail.com', password: 'password2' },
];

const jwt = require('jsonwebtoken');
const jwtSecret = 'djvgnJVBLKndbgWLKDGKwdbgnhWGKNQGLKwrnghkWNGKwrgn';

const QUESTIONS = [
  {
    title: 'Two states',
    description: 'Given an array, return the maximum of the array?',
    testCases: [
      {
        input: '[1,2,3,4,5]',
        output: '5',
      },
    ],
  },
];

const SUBMISSIONS = [];

const ADMIN_TOKEN = 'tyhurtyioerhgjbgnbnfjgbndjhgj';

const HARD_TODOS = [];


app.use(express.json());

// function to generate a Web token for users
function generateUserToken(user) {
  return jwt.sign({ email: user.email }, jwtSecret, { expiresIn: '1h' });
}

// Signup route
app.post('/signup', function (req, res) {
  const { email, password } = req.body;
  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser) {
    res.status(409).send('User with this email already exists');
  } else {
    USERS.push({ email, password });

    // Generate a web token for the newly signed up user
    const token = generateUserToken({ email });
    res.status(200).json({ message: 'User signed up successfully', token });
  }
});

// Login route
app.post('/login', function (req, res) {
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);

  if (!user || user.password !== password) {
    res.status(401).send('Authentication failed');
  } else {
    // Generate a web token for the logged-in user
    const token = generateUserToken(user);
    res.status(200).json({ message: 'Authentication successful', token });
  }
});

// Questions route
app.get('/questions', function (req, res) {
  res.status(200).json(QUESTIONS);
});

// Submissions route
app.post('/submissions', function (req, res) {
  const { problem, solution } = req.body;

  if (!problem || !solution) {
    res.status(400).send('Missing problem or solution in the request body');
  } else {
    const isAccepted = Math.random() < 0.5;
    SUBMISSIONS.push({ problem, solution, isAccepted });

    if (isAccepted) {
      res.status(200).json({ message: 'Submission accepted' });
    } else {
      res.status(200).json({ message: 'Submission rejected' });
    }
  }
});

// Admin route to add a new problem
app.post('/admin/addproblem', function (req, res) {
  const adminToken = req.header('Authorization');

  if (adminToken !== ADMIN_TOKEN) {
    res.status(401).send('Unauthorized');
  } else {
    const { title, description, testCases } = req.body;

    if (!title || !description || !testCases) {
      res.status(400).send('Missing required fields for the problem');
    } else {
      QUESTIONS.push({ title, description, testCases });
      res.status(200).send('Problem added successfully');
    }
  }
});

// Hard TO-DOs

app.post('/user/addhardtodo', authenticateUser, (req, res) => {
  const user = req.user; // Assuming you have user information in the request
  const { problem } = req.body;

  if (!problem) {
    res.status(400).send('Missing problem information');
  } else {
    // Find the user's entry in HARD_TODOS or create one if it doesn't exist
    let userEntry = HARD_TODOS.find(entry => entry.user === user.email);

    if (!userEntry) {
      userEntry = { user: user.email, hardTodos: [] };
      HARD_TODOS.push(userEntry);
    }

    // Add the problem to the user's hard todo list
    userEntry.hardTodos.push(problem);

    res.status(200).send('Problem added to hard todo list');
  }
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
