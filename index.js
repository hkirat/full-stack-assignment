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

app.use(express.json()); 0

app.post('/signup', function(req, res) {
  // Decode the request body
  const { email, password } = req.body;

  // Check if user already exists
  const userExists = USERS.find((user) => user.email === email);
  if (userExists) {
    return res.status(409).send('User already exists');
  }

  // Store new user in USERS array
  USERS.push({ email, password });

  // Return success status code
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  // Decode the request body
  const { email, password } = req.body;

  // Check if user exists and password matches
  const user = USERS.find((user) => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // Generate a random token (for now)
  const token = Math.random().toString(36).substr(2);

  // Return success status code and token
  res.status(200).json({ token });
});

    
app.get('/questions', function(req, res) {
  // Return all questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});
    

 app.get('/submissions', function(req, res) {
  // Return all submissions for this problem
  const { problemId } = req.query;
  const submissions = SUBMISSION.filter(submission => submission.problemId === problemId);

  res.status(200).json(submissions);
});

app.post('/submissions', function(req, res) {
  // Let the user submit a problem, randomly accept or reject the solution
  const { problemId, solution } = req.body;
  const isAccepted = Math.random() >= 0.5;

  // Add new submission to SUBMISSION array
  SUBMISSION.push({ problemId, solution, isAccepted });

  // Return success message with submission status
  const status = isAccepted ? 'accepted' : 'rejected';
  return res.status(201).json({ status });
});

app.post('/problems', function(req, res) {
  // Add a new problem to the PROBLEMS array
  const { title, description, difficulty } = req.body;

  // Check if the user making the request is an admin
  const isAdmin = req.user && req.user.isAdmin;

  if (!isAdmin) {
    return res.status(403).send('Forbidden');
  }

  // Generate a new problem ID (for demo purposes only)
  const problemId = PROBLEMS.length + 1;

  // Add new problem to PROBLEMS array
  PROBLEMS.push({ problemId, title, description, difficulty });

  // Return success message
  return res.status(201).send('Problem created successfully');
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
