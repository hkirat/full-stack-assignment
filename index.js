const express = require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express()
const port = 3001

const secretKey = 'YourSecretKey'; // Replace with your own secret key

const USERS = [];

const QUESTIONS = [{
  questionId: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.use(bodyParser.json());

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  
  // Check if req.body is not an object
  if (typeof req.body !== 'object' || req.body === null) {
    return res.status(400).send('Invalid request body.');
  }

  // Check if email or password is missing
  if (!email || !password) {
    return res.status(400).send('Invalid email or password.');
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
  const existingUser = USERS.find(user=>user.email === email);
  if (existingUser) {
    return res.status(400).send('Email already exists.');
  }

  // Create a new user object
  const newUser = { email, password };

  // Push the new user into the array
  USERS.push(newUser);

  // Send a success response
  res.status(200).send('User registered successfully.');

  // return back 200 status code to the client
  // res.send(requestBody)
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  
  // Check if req.body is not an object
  if (typeof req.body !== 'object' || req.body === null) {
    return res.status(400).send('Invalid request body.');
  }

   // body should have email and password
  if (!email || !password) {
    return res.status(400).send('Invalid email or password.');
  }
 
// Check if the user with the given email exists in the USERS array
  const existingUser = USERS.find(user=>user.email === email);
  if (existingUser === undefined) {
    return res.status(401).send('User does not exist');
  }

  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  if(existingUser.password !== password){
    return res.status(401).send("Invalid password");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const randomString = crypto.randomBytes(10).toString('hex');
  const token = jwt.sign({ emailId: email }, secretKey);
  res.status(200).send(token);
})


const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized');
      } else {
        // Store the decoded payload in the request object for further use
        req.email = decoded;
        next();
      }
    });
  } else {
    res.status(401).send('Unauthorized');
  }
};


app.get('/questions', authenticateToken, function(req, res) {

  //return the user all the questions in the QUESTIONS array
  console.log("logged in email is - "+ req.email.emailId);
  res.status(200).send(QUESTIONS);
})

app.get("/submissions", authenticateToken, function(req, res) {
   // return the users submissions for this problem
  res.status(200).send(SUBMISSION);
});


app.post("/submissions", authenticateToken, function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const {questionId, userEmailId, submission} = req.body;

   //check if authenticatedUser is sending submission
   if(req.email.emailId !== userEmailId){
    return res.status(400).send("Wrong emailId");
   }  
  
   //check if questionId exists for submission
   const doesExist = QUESTIONS.find(question=>question.questionId===parseInt(questionId));
   if(!doesExist){
    return res.status(404).send("Question is not found");
   }

   //atlast create a new submission object and append to SUBMISSIONS
   const newSubmission = {
    questionId: questionId,
    emailId: userEmailId,
    submission: submission,
    timestamp: new Date().toISOString()
   }

   SUBMISSION.push(newSubmission);

   return res.status(201).send("Submission successfull");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})