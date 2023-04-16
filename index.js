const express = require('express')
const app = express()
const port = 3000

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
  }]
}];
const SUBMISSIONS = [{}];

app.use(express.json());

app.post('/signup', function(req, res) {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  USERS.push({ email, password, role });

  res.status(200).json({ message: 'User successfully signed up' });
})

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existingUser = USERS.find(user => user.email === email);
  if (!existingUser || existingUser.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = Math.random().toString(36).substring(2);
  res.status(200).json({ token });
})

app.get('/questions', function(req, res) {
  // res.status(200).json({ QUESTIONS });
  if(existingUser){
    res.status(200).json({ QUESTIONS });
  }
})

app.get('/submissions', function(req, res) {

  res.status(200).json({ SUBMISSIONS });
})
app.post("/submissions", function(req, res) {
  
  const { questionId, solution } = req.body;
  var status = "";
  // Randomly accept or reject the submission
  const accepted = Math.random() < 0.5;
  if (accepted) {
    // send a success response
    status = "accepted";
    res.status(200).json({ message: 'Your solution was accepted!' });
  } else {
    // send a rejection response
    status = "rejected";
    res.status(401).json({ message: 'Your solution was rejected.' });
  }
  
  const submission = {
    
    questionId,
    solution,
    status
  };
  SUBMISSIONS.push(submission);
});
app.post("/questions", function(req, res) {
  
  const { email, title, description, testCases  } = req.body;
  const user = USERS.find(user => user.email === email);
  if (!user || user.role !== 'admin') {
    return res.status(401).send('You are not authorized to perform this action.');
  }
  else{
    QUESTIONS.push({ title, description, testCases });
    res.status(200).json({ message: 'Question successfully added' });
  }
});
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})