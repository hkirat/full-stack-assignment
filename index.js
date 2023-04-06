const express = require('express')
const app = express()
const port = 3000

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

  const {email , password} = req.body;

  if(!email || !password){
    res.status(400).send("Email and Password is required")
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const userExists = USERS.some(user => user.email === email);

  if(userExists){
    res.send("user already exist");
  }
  else{
    USERS.push({email,password});
  }

  // return back 200 status code to the client
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email , password} = req.body;

  const user = USERS.find((user) => user.email === email);

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if(user && user.password === password){
    res.status(200).send("vjchfxcjcjkjbkbk");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  else{
    res.status(401);
  }


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
  
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
  const {problem,submission} = req.body;
  const accept = Math.floor(Math.random() *1);
   // let the user submit a problem, randomly accept or reject the solution
   const userSubmit = {problem,submission,accept};
   // Store the submission in the SUBMISSION array above
   SUBMISSION.push(userSubmit);
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

function isAdmin(req,res,next){
  if(req.user && req.user.role === 'admin'){
    next();
  }
  else{
    res.status(401);
  }
}

app.get('/add',isAdmin,function(req,res){

  const newQuestion = req.body

  QUESTIONS.push(newQuestion);

})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})