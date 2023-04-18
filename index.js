const express = require('express')
const app = express()
const port = 3001

const USERS = [];
const PASSWORDS = [] ; 

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
  const {email , password} = req.body ; 
  const oldUser =  USERS.find(user => user.email === email);
  if(oldUser) return res.status(400).json({msg :'user already exists'}) ; 
 //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email , password}) ; 
   // return back 200 status code to the client
  return res.status(200).json({msg :'signup successful'}); 
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email , password} = req.body ; 
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
 const user =  USERS.find(user => user.email === email);
  if(!user) return res.status(400).json({msg :'invalid username'}) ; 
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  res.send('login successful')
  // If the password is not the same, return back 401 status code to the client
  if(exists.password!==password){
    return res.status(401).json({
      message:"Invalid password"
    });
  }
  return res.status(200).json({msg :'login successful'}); 
 
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const submission = req.submission ; 
   if(Math.random>0.5) return res.send('Not Accepted')
   // Store the submission in the SUBMISSION array above
   SUBMISSION.push(submission) ; 
   return res.status(200).json({msg :'submitted'}) ; 

});

// leaving as hard todos
// Create a route that lets an admin add a new problem

app.post('/add-problem', function(req, res) {
 
  const {email , password} = req.body ; 
  const user =  USERS.find(user => user.email === email);
  if(!user) return res.status(400).json({msg :'invalid username'}) ;
  if(exists.password!==password){
    return res.status(401).json({
      message:"Invalid password"
    });
  }
// ensure that only admins can do that.
  if (email !== 'admin@example.com') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const newProblem = {
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases.map((testCase) => ({
      input: testCase.input,
      output: testCase.output
    }))
  };

  QUESTIONS.push(newProblem);

  res.sendStatus(200);
});
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})