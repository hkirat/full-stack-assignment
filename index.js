const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');

const ADMINS = ['admin1', 'admin2', 'admin3']
const USERS = [];
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];
const SUBMISSION = [];

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/signup', function(req, res) {

    const { email, password } = req.body;
  
  
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)
    const userExists = USERS.some(user => user.email === email);


    if (userExists) {
        // User already exists, send a response with an error message
        res.status(409).send('The email youre trying to use already has a user associated with it!');
    } else {
        // User doesn't exist, add them to the array
        USERS.push({ email, password });
    }
    res.status(200).send('User created successfully!');
});  
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/submissions", (req, res) => {
    const userId = req.body.userId
    const problemId = req.body.problemId
    const solution = req.body.solution
  
    // Randomly accept or reject the solution (50/50 chance)
    const isAccepted = Math.random() < 0.5
  
    // Create a new submission object
    const submission = { userId, problemId, solution, isAccepted, timestamp: new Date() }
  
    // Add the submission to the SUBMISSIONS array
    SUBMISSION.push(submission)
  
    // Return a response indicating whether the solution was accepted or rejected
    const status = isAccepted ? 'accepted' : 'rejected'
    res.send(`Your solution has been ${status}!`)
});
  

app.post('/login', function(req, res) {
    // Add logic to decode body
    const { email, password } = req.body;
  
    // Check if the user with the given email exists in the USERS array
    const user = USERS.find(user => user.email === email);
  
    if (user && user.password === password) {
      // User is authenticated, generate a token (for now, we'll just use a random string)
      const token = Math.random().toString(12).substring(5);
  
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
      user.token = token;
  
  
      // Send a response with a 200 status code and the token in the body
      res.status(200).send({ token });
    } else {
      // User is not authenticated, send a response with a 401 status code
      res.status(401).send(' Login Failed, Please check Your Username or Password!');
    }
});

app.get('/questions', function(req, res) {
    res.send(QUESTIONS);
});

app.get("/submissions", (req, res) => {
    const userId = req.query.userId
    const problemId = req.query.problemId
  
    // Filter submissions by user ID and problem ID (if provided)
    const userSubmissions = SUBMISSION.filter(submission => {
      if (problemId) {
        return submission.userId === userId && submission.problemId === problemId
      } else {
        return submission.userId === userId
      }
    })
  
    // Return user's submissions for the problem (if problem ID provided)
    // or all user's submissions (if no problem ID provided)
    res.send(userSubmissions)
});

app.post('/problems', (req, res) => {
    const userRole = req.body.role
    const problem = req.body.problem
  
    // Check if the user is an admin
    if (!ADMINS.includes(userRole)) {
      return res.status(401).send('Unauthorized')
    }
  
    // Add the problem to the PROBLEMS array
    PROBLEMS.push(problem)

res.status(200).send('Problem added successfully')
});

app.listen(port, function () {
    console.log(`Example app listening on port  ${port}`);
});