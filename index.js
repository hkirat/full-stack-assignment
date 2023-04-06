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

  // Check if user already exists
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    res.status(400).send("User already exists");
    return;
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const newUser = {
   email,
   password
  };
  USERS.push(newUser);

  // return back 200 status code to the client
    res.status(200).send("User created successfully");

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email && user.password === password);
  if (user) {
    // Generate random token and send it back to the client
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    const token = Math.random().toString(36).substr(2);
    res.status(200).send({ token });
  } else {
    res.status(401).send("Unauthorized");
  }
})



app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const { problemTitle } = req.query;

  // Filter submissions by problem title (if provided)
  const filteredSubmissions = problemTitle
    ? SUBMISSIONS.filter(submission => submission.problemTitle === problemTitle)
    : SUBMISSIONS;

  res.status(200).send(filteredSubmissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const { problemTitle, code } = req.body;
   const isAccepted = Math.random() >= 0.5;

   // Store the submission in the SUBMISSION array above
    const newSubmission = {
    problemTitle,
    code,
    isAccepted
  };
  SUBMISSIONS.push(newSubmission);

  // Send response to client
  const status = isAccepted ? 200 : 400;
  res.status(status).send(isAccepted ? "Accepted" : "Rejected");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.post('/problems', function(req, res) {
  const { title, description, testCases } = req.body;

  // Check if user is an admin (in this case, just assume they are)
  const isAdmin = true;

  // Add new problem to QUESTIONS array
  // ensure that only admins can do that.
  if (isAdmin) {
    const newProblem = {
      title,
      description,
      testCases
    };
    QUESTIONS.push(newProblem);
    res.status(200).send("Problem added successfully");
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})