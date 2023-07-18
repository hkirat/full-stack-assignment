const express = require('express')
const app = express()
const port = 3001

const USERS = [
  {
    email: "xyz@gmail.com",
    password: "xyz@123",
    admin: true
  }
];

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
  const{email, password} = req.body;


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
 //checking if the user with the given email and password exist ornot 
 const ExistingUser = USERS.find(user => user.email === email )

 if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // If the user with the given email doesn't exist, add the new user to the USERS array
  USERS.push({ email, password });

  // Return back 200 status code to the client
  return res.sendStatus(200);
  
})

app.post('/login', function(req, res) {
 const {email, password} = req.body;

 const user = USERS.find(user => user.email === email);

 if(!user || user.password !== password){
    return res.status(401).json({error:' unauthorized'});
 }

 const token = generateToken();

 return res.status(200).json({ token });
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.status(200).json(SUBMISSIONS);
});


app.post("/submissions", function(req, res) {
    const isAccepted = Math.random() >= 0.5;

    // Store the submission in the SUBMISSIONS array
    SUBMISSIONS.push({ solution: req.body.solution, accepted: isAccepted });
  
    // Return a response indicating the submission result
    res.status(200).json({ accepted: isAccepted });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})