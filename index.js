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

app.post('/signup', function(req, res) {
    // Add logic to decode body
    const { email, password } = req.body;

    // Check if the user with the given email exists in the USERS array
    const userExists = USERS.some(user => user.email === email);
  
    if (userExists) {
      // If the user already exists, return 409 (conflict) status code to the client
      return res.status(409).send('User already exists');
    }
  
    //Store email and password (as is for now) in the USERS array above
    USERS.push({ email, password });
    
    // return back 200 status code to the client
    res.sendStatus(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  if (!user || user.password !== password) {
    // If the user doesn't exist or the password is incorrect, return 401 (unauthorized) status code to the client
    return res.status(401).send('Invalid email or password');
  }

  // If the password is correct, generate a random token and send it back to the client
  const token = Math.random().toString(36).substr(2, 10);
  res.status(200).send({ token });
})

app.get('/questions', function(req, res) {

    // Return all the questions in the QUESTIONS array
    res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  // Get the question ID from the request params
  const questionId = req.query.questionId;

   // Find all the submissions for the given question
   const questionSubmissions = SUBMISSION.filter(submission => submission.questionId === questionId);

   res.send(questionSubmissions);
});


app.post("/submissions", function(req, res) {
   // Get the question ID and solution from the request body
  const { questionId, solution } = req.body;

  // Randomly accept or reject the solution (for demo purposes only)
  const isAccepted = Math.random() > 0.5;

  // Create a new submission object
  const newSubmission = {
    questionId,
    solution,
    isAccepted
  };

  // Add the submission to the SUBMISSIONS array
  SUBMISSION.push(newSubmission);

  res.send(newSubmission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})