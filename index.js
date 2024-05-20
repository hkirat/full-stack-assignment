const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

app.use(bodyParser.json());

const ADMIN_TOKEN = 'adminSecretToken';

const USERS = [];

var cnt = 1;
const QUESTIONS = [
  {
    Id: cnt++,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    Id: cnt++,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
];


const SUBMISSION = [

]

app.post('/signup', function (req, res) {
  var data = req.body;

  if (!data.email || !data.name || !data.password) {
    return res.status(400).json({ error: 'Bad Request', message: 'Email, name, and password are required fields.' });
  }

  var { email, name, password } = data;

  if (USERS.find(user => user.Email === email)) {
    return res.status(409).json({ error: 'User already exists', message: 'A user with the provided email already exists.' });
  } else {
    USERS.push({
      Name: name,
      Email: email,
      Password: password,
      submission: []
    });
    return res.status(200).json({ message: 'User registered successfully', user: { Name: name, Email: email } });
  }
});

app.post('/login', function (req, res) {
  var data = req.body;
  var { email, password } = data;

  const user = USERS.find(user => user.Email === email);

  if (user) {
    if (user.Password === password) {
      return res.status(200).json({ message: 'Login successful', token: 'randomToken' });
    } else {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }
  } else {
    return res.status(404).json({ error: 'Not Found', message: 'User not found' });
  }
});

app.get('/questions', function (req, res) {
  res.json({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  var email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: 'Bad Request', message: 'Email query parameter is required.' });
  }

  const user = USERS.find(user => user.Email === email);

  if (user) {
    res.json({ submissions: user.submission });
  } else {
    res.status(404).json({ error: 'Not Found', message: 'User not found' });
  }
});

app.post("/submissions", function (req, res) {
  var { email, questionId, submission } = req.body;

  if (!email || !questionId || !submission) {
    return res.status(400).json({ error: 'Bad Request', message: 'Email, questionId, and submission are required fields.' });
  }

  const user = USERS.find(user => user.Email === email);
  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: 'User not found' });
  }

  const question = QUESTIONS.find(q => q.Id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Not Found', message: 'Question not found' });
  }

  const isAccepted = Math.random() > 0.5; // Randomly accept or reject the submission

  user.submission.push({
    questionId,
    submission,
    isAccepted
  });

  SUBMISSIONS.push({
    email,
    questionId,
    submission,
    isAccepted
  });

  res.json({ message: 'Submission received', isAccepted });
});

// Admin route to add a new question
app.post('/admin/questions', function (req, res) {
  const token = req.headers.authorization;
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
  }

  const { title, description, testCases } = req.body;
  if (!title || !description || !testCases) {
    return res.status(400).json({ error: 'Bad Request', message: 'Title, description, and test cases are required' });
  }

  const newQuestion = {
    Id: cnt++,
    title,
    description,
    testCases
  };

  QUESTIONS.push(newQuestion);

  res.json({ message: 'Question added successfully', question: newQuestion });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});