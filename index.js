const express = require('express')
const app = express()
const port = 3001

interface User{
  email: string,
  password : string,
  role: string
}

const USERS : User[]=[];

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
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    role: "user",
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const isExist = USERS.find(user=> user.email===newUser.email);

  if(isExist)
  {
    res.status(409).json({message:"The user is already exists."});
  }
  else{
    USERS.push(newUser);
    res.status(200).send("User is Successfully creadted");
  }

  // return back 200 status code to the client
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const newUser = {
    email: req.body.email,
    password: req.body.password,
  }
  // Check if the user with the given email exists in the USERS array
   const isExist = USERS.find(user=> user.email===newUser.email && user.password===newUser.password);

  if(isExist)
  {
    res.status(200).send("welcome you are login, Hello World from route 2!");
  }
  else{
    res.status(401).json({message:"Email or password does not match."});
  }
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   
  const randomSubmission= Math.floor((Math.random()*100)%10);
  const responseData={
    message:"Hello World from route 4!",
    submissions: randomSubmission
  }
  res.send(responseData);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.



//Now solving the hard part of the code


app.post("/problems",isAdmin,function(req,res){
  
  const newProblem = {
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases,
  }
  QUESTIONS.push(newProblem);
  res.status(200).json({message:"Problem is successfully added"});
})

function isAdmin(req,res,next){
  if(req.user && req.user.role==="admin"){
    next();        //giving access to the next middelware
  }
  else{
    res.status(401).json({message:"Unauthorized. Admin access required."});  
  }
}


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});