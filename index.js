const express = require('express')
const jwt=require('jsonwebtoken')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 3001

const Users = [];

const Questions   = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    question_ID:1,
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const Submissions = [

];

//special key generator function
function generateSecretKey() {
  const timestamp = Date.now().toString(); // Generate a timestamp
  const randomBytes = crypto.randomBytes(16).toString('hex'); // Generate random bytes

  // Create a unique secret key by combining the timestamp and random bytes
  const secretKey = crypto
    .createHash('sha256')
    .update(timestamp + randomBytes)
    .digest('hex');

  return secretKey;
}

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  if(!req.body){
    return res.status(400).json({error: "'Request body is empty or undefined'"});   
  }

  const {email ,password} = req.body;

  if(!email || !password){
    return res.status(400).json({ error: 'Email and password are required' });}

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const NewUser={email: email, password: password};
  Users.push(NewUser);

  // return back 200 status code to the client
   return res.status(200).json({message: "signn-up successful"});
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  if(!req.body){
    return res.status(400).json({error: 'Request body is empty or undefined'});   
  }

  const {email ,password} = req.body;

  if(!email || !password){
    return res.status(400).json({ error: 'Email and password are required' });} 

  for(const User of Users){
    if(email === User.email && password === User.password){
       res.status(200).json({message:"login is validated"})
       const UserSecretKey = generateSecretKey();
       const token=jwt.sign({email},UserSecretKey);
       res.json({ token });
    }
    else{
      res.status(401).json({ error: 'Incorrect email or password' });
    }
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})


app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(Questions);
 // res.send("Hello World from route 3!")
})

let submissionCount = 0; 

app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  if(!req.body){
   return res.status(400).json({error: "'Request body is empty or undefined'"});   
 }

 const {question_ID , response} = req.body;

 if(!question_ID || !response){
   return res.status(400).json({ error: 'Question_ID and response both are required' });}

 const isAccepted =Math.random() < 0.5;
 submissionCount++;

 // const getStatus = (isAccepted) => {
 //   return isAccepted ? "Accepted" : "Not accepted";
 // };
 //we could have done that if we wanted to return the status as a string instead of a boolean value
 
 //here is a easy way to do that , i.e directly modifying NewSubmission object.-----------
 
 const NewSubmission={

  question_ID: question_ID,
  submission_ID: `${question_ID}_sol_${submissionCount}`, //an alternate and direct way of generating a random ID for the submission is with the help of uuidv4() from uuid package
  response: response,
  Status:isAccepted?
  "Accepted":"Not accepted"};

 Submissions.push(NewSubmission);

 res.status(200).json({ message: "Submission successful" });
 
});


app.get('/submissions', (req, res) => {
  const { questionId } = req.body;
  
  // Check if questionId is present in the request body
  if (!questionId) {
    return res.status(400).json({ error: 'Question ID is required in the request body' });
  }
  
  // Find the submissions for the specified question ID
  const userSubmissions = Submissions.filter(submission => submission.question_ID === questionId);
  
  // Check if any submissions exist for the given question ID
  if (userSubmissions.length === 0) {
    return res.status(404).json({ error: 'No submissions found for the specified question ID' });
  }
  
  // Send the submissions as a response
  res.status(200).json({ submissions: userSubmissions });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})