const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // import the jsonwebtoken package

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5",
    }]
}];


const SUBMISSION = [{
  "problemId": "1",
  "userId": "XYZ123",
  "submissionId": "123",
  "language": "any",
  "timeStamp": "2023-04-07T4:26:13",
}];



// here we create a user array
const users = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
  { email: 'user3@example.com', password: 'password3' },
];

app.post('/signup', async function(req, res) {
  // Add logic to decode body
  // body should have email and password
  
  const {email, password} = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user with the given email already exists
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    // User already exists, return an error response
    return res.status(409).send('User already exists');
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // for Adding the new user to the users array 
  USERS.push({ email, hashedPassword });
  // Return a success response & return back 200 status code to the client  
  res.status(200).send('User created successfully');
});


app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array

  // We Find the user with the given email
  const user = users.find(user => user.email === email);

  if (!user) {
    // User doesn't exist, return an error response
    return res.status(401).send('Invalid email or password');
  }
  

  // Also ensure that the password is the same
  if (user.password !== password) {
    // Password is incorrect, return an error response
    return res.status(401).send('Invalid email or password');
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)

  // So as Authentication successful, we create a (joswebtoken)JWT token
  const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
  
  // Send the token along with the success response
  res.json({ message: 'Login successful', token });

  res.send('Hello World from route 2!');
});



app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!");
  res.status(200).send(QUESTIONS);
});


app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!");
  
  const problemId = req.params.problemId;
  const userSubmissions = SUBMISSION.filter(submission => submission.problemId === problemId && submission.userId === req.user.id);
  res.send(userSubmissions);
});


app.post("/submissions", function(req, res) {

  const { problemId, userId, solution } = req.body;

  // Check if problem exists
  const problem = QUESTIONS.find(q => q.Id === problemId);
  if (!problem) {
    return res.status(404).send('Problem not found');
  }
   
  
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const submission = {
  id: SUBMISSION.length + 1,
  userId: userId,
  problemId: problemId,
  solution: solution,
  timeStamp: new Date().getTime(),
  status: Math.random() < 0.5 ? 'accepted' : 'rejected'
  };

  SUBMISSION.push(submission);
  res.send(submission);
  res.send("Hello World from route 4!");

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', (req, res) => {
  // Check if user is authenticated and is an admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get the problem data from the request body
  const { title, description, difficulty } = req.body;

  // Generate a new unique ID for the problem
  const newProblemId = uuidv4();

  // Create a new problem object with the given data
  const newProblem = {
    id: newProblemId,
    title,
    description,
    difficulty
  };

  // Add the new problem to the array of problems
  QUESTIONS.push(newProblem);

  // Return the newly created problem object as a response
  res.status(201).json(newProblem);
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});