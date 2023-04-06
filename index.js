const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Find Max Element",
    description: "Given an array , return the maximum element in the array?",
    testCases: [{
        input: "[4,2,1,3,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {

  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body

  // Checking if user already exists
  const userExists = USERS.find(user=>user.email === email);
  if(userExists){
    // 409 status code: as the result of processing the request would create a conflict within the resource
    return res.status(409).send('User with the same email-id already exists');
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email,password});

  // return back 200 status code to the client indicating the request has succeded
  res.status(200).send('User Signed-Up Successfully!');
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  // If the password is not the same, return back 401 status code to the client
  if(!user || user.password != password){
    // 401 status code: the client request has not been completed because it lacks valid authentication credentials for the requested resource
    return res.status(401).send('Invalid email or password');
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = Math.random().toString(36).substring(7); // Generates token from 7th character of base-36 string
  res.status(200).send({token});
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array (in json form)
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  
  // getting token from header of the http request  
  const token = req.headers.token; 
  
  // token used to identify and filter out user's submission
  const userSubmissions = SUBMISSION.filter(submisson => submisson.token === token);
  
  // return the users submissions for this problem
  res.json(userSubmissions);
});


app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  
  // getting token from header of the http request  
  const token = req.headers.token; 
  const {questionIdx, solution} = req.body;

  // Randomly accept/reject solution
  const isAccepted = Math.random() < 0.5;

  // user submission with other details
  const submission = {token, questionIdx, solution, isAccepted};
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(submission);

  res.status(200).json("Submission Recieved!");
});

// Admin Route to add questions
app.post('/addQuestions', (req,res)=>{
  
  // getting token from header of the http request  
  const token = req.headers.token;
  // requesting questions details from body
  const {title, description, testCases} = req.body;

  // To check if admin or not
  const isAdmin = Math.random() < 0.5;
  // 401 status code: the client request has not been completed because it lacks valid authentication credentials for the requested resource
  if (!isAdmin) {
    return res.status(401).send('Only admins are authorised to add new problems');
  }

  // adding new questions to QUESTIONS array
  const newQuestion = { title, description, testCases };
  QUESTIONS.push(newQuestion);

  // server sends response back to client as a result of client's request with status code 200 indicating the request has succeded
  res.status(200).send(newQuestion);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})