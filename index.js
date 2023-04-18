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
  const { email, password }= req.body;
  // body should have email and password
 

  //send error 400 if user already exists
  const duplicacy = USERS.find(user => user.email === email);
  if (duplicacy) {
    return res.status(400).json({ message: 'User already exists' });
  }
  //adding new user
  USERS.push({email, password});

  // return back 200 status code to the client

  return res.status(200).json({
    message:'User registration successfull'
  });
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password}=req.body;
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const exists=USERS.find(user => user.email===email);
  if(!exists)return res.status(401).json({
    message:"Invalid email or password"
  });

  if(exists.password!==password){
    return res.status(401).json({
      message:"Invalid email or password"
    });
  }
  
  const token='random string';
  return res.status(200).json({
    message:'logged in successfully',token
  })
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  const ques=[];
  QUESTIONS.map((q)=>{
    ques.push(
      {
      title: q.title,
      description: q.description,
      testCases: q.testCases
    });
  })
  res.json(ques);
  
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.json(SUBMISSION);
});



   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/submissions", function(req, res) {
  const {problemId, solution} = req.body;
  const isAccepted = Math.random() < 0.5;
  const submission = {problemId, solution, isAccepted};
  if(!isAccepted) {
   SUBMISSION.push([...submission]);
   res.status(201).send("submission Accepted");
  }else {
   res.status(400).send("submission Rejected");
  }
});
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})