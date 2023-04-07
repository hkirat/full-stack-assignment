const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Sample data
const USERS = [];
const QUESTIONS = [];
const SUBMISSIONS = [];

// Secret key for JWT
const JWT_SECRET = 'secret-key';
const JWT_EXPIRATION = '1h';

// Middleware to parse JSON data
app.use(express.json());

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    req.user = user;
    next();
  });
};

// Endpoint for getting all questions
app.get('/questions', authenticateToken, (req, res) => {
  res.json(QUESTIONS);
});

// Endpoint for adding a new question
app.post('/questions', authenticateToken, (req, res) => {
  const { user_id, user_type } = req.user;
  
  // Only allow admins to add questions
  if (user_type === 'admin') {
    const { question_text } = req.body;
    const question_id = QUESTIONS.length + 1;
    const question = { question_id, question_text };
    
    QUESTIONS.push(question);
    console.log(QUESTIONS);
    res.status(201).json(question);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Endpoint for getting all submissions of the current user
app.get('/submissions', authenticateToken, (req, res) => {
  const { user_id } = req.user;
  const user_submissions = SUBMISSIONS.filter(submission => submission.user_id === user_id);
  res.json(user_submissions);
});

// Endpoint for submitting a new solution
app.post('/submissions', authenticateToken, (req, res) => {
  const { user_id } = req.user;
  const { question_id, solution } = req.body;
  
  const submission = { user_id, question_id, solution };
  SUBMISSIONS.push(submission);
  res.status(201).json(submission);
});

// Endpoint for signing up a new user
app.post('/signup', (req, res) => {
  const { email, password, user_type } = req.body;
  const user_id = USERS.length + 1;

  if(user_type!='admin' && user_type!='user'){
    return res.status(400).json({ message: 'Invalid user type' });
  }

  const userExist = USERS.find(user => user.email === email);

  if(userExist){
    return res.status(409).json({ message: 'User already exist' });
  }
  
  const user = { user_id, email, password, user_type };
  USERS.push(user);
  console.log(USERS);

  //we may or may not need to login the user after signup
  //here I'm directly logging in the user after signup
  //if you don't want to login the user after signup, remove the below code
  const token = jwt.sign({ user_id, user_type }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  res.status(201).json({ user, token });
});

// Endpoint for logging in an existing user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email and password
  const user = USERS.find(user => user.email === email && user.password === password);
  
  if (user) {
    const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    res.json({ user, token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));