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

  // Check if user with the given email already exists in the USERS array
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    return res.status(409).send('User already exists');
  }

  // Store email and password (as is for now) in the USERS array
  USERS.push({ email, password });

  // Return back 200 status code to the client
  res.sendStatus(200);
});


app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Find the user with the given email in the USERS array
  const user = USERS.find(user => user.email === email);

  // Check if the user exists and if the password is correct
  if (user && user.password === password) {
    // Generate a token (any random string) for authentication
    const token = generateRandomToken();

    // Return back 200 status code and the token to the client
    return res.status(200).json({ token });
  }

  // If the user does not exist or the password is incorrect, return back 401 status code
  res.sendStatus(401);
});


app.get('/questions', function(req, res) {

  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   res.json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
  // Get the submission data from the request body
  const submission = req.body;

  // Randomly decide whether to accept or reject the solution
  const isAccepted = Math.random() < 0.5; // Adjust the probability as needed

  // Add the submission to the SUBMISSIONS array
  SUBMISSIONS.push({
    ...submission,
    isAccepted
  });

  // Return a response to the client indicating if the solution is accepted or not
  if (isAccepted) {
    res.status(200).send("Solution accepted");
  } else {
    res.status(400).send("Solution rejected");
  }
});
app.post('/problems', function(req, res) {

  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send('Unauthorized');
  }

 


  const problem = req.body;
 
  QUESTIONS.push({problem});
  // Return a success message
  res.status(200).send('Problem added successfully');
});



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})