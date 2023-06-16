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
  // body should have email and password
  const { email, password } = req.body;

  // Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)
  const existingUser = USERS.find(user => user.email === email);
  if (!existingUser) {
    USERS.push({ email, password });
  }

  // Return back 200 status code to the client
  res.sendStatus(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email);
  if (user && user.password === password) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = 'random-token';
    res.status(200).json({ token });
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.sendStatus(401);
  }
})

app.get('/questions', function(req, res) {
  // Return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
  // Retrieve the user's submissions for this problem based on some criteria
  const userSubmissions = getUserSubmissions(req.user.id, req.query.problemId);

  // Return the user's submissions as a response
  res.json(userSubmissions);
});


app.post("/submissions", function(req, res) {
  // Generate a random boolean value to randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSION array above
  SUBMISSIONS.push({
    userId: req.user.id,
    problemId: req.body.problemId,
    solution: req.body.solution,
    isAccepted
  });

  // Return the result of the submission to the user
  res.json({ accepted: isAccepted });
});

app.post("/problems", function(req, res) {
  // Check if the user is an admin
  if (req.user.role !== "admin") {
    return res.sendStatus(401);
  }

  // Add logic to create a new problem
  // ...

  // Return success message
  res.json({ message: "Problem created successfully" });
});
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})