const express = require('express')
const jwt = require('jsonwebtoken')
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
{
  problemid: 123, 
  solution:"hbubhjnkj mlkjn", 
  isAccepted: true,
  madeBy: "email of user"
}
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.body
  // body should have email and password
  if( !email || !password ){
    return res.status(400).json({message:'add all fields'})
  }

  const userExists = USERS.find(user => user.email === email);
  if(userExists){
    return res.status(409).json({message:'user already exist'})
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const newUser = {
    email,
    password,
    isAdmin: false
  };

  USERS.push(newUser);

  // return back 200 status code to the client
  return res.status(200).json({message:'Signup Successfull'})
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  
  // body should have email and password
  if( !email || !password ){
    return res.status(400).json({message:'add all fields'})
  }

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  
  const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, 'your_secret_key');

  return res.status(200).json({ token });
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function(req, res) {

  
   // return the users submissions for this problem
   
   // if we have to return all the submissions made by all the users
   return res.status(200).json(SUBMISSION)

    // if we have to return all submission for a particular problem
    //  let submission = SUBMISSION.find(sub => sub.problemid = req.params.problemid)
    // return res.status(200).json(submission)

    // if we have to get all the submissions made by current user
    // let submission = SUBMISSION.find(sub => sub.madeBy = req.user.email) //we will store req.user in auth middleware while verifying token
    // return res.status(200).json(submission)
});


app.post("/submissions", function(req, res) {

   // let the user submit a problem, randomly accept or reject the solution
   const { problemid, solution } = req.body;

  const isAccepted = Math.random() < 0.5;

  const submission = { problemid, solution, isAccepted  }; // we can send madeBy filed : req.user.email when middleware is added 

  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(submission);

  res.sendStatus(200);
  
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/problem", (req, res)=>{
  const isAdmin = req.user && req.user.isAdmin; // it is only possible when we have added auth middleware for token verification

  if (!isAdmin) {
    return res.sendStatus(401);
  }

  const { title, description ,testCases} = req.body;

  if( !title, !description ,!testCases ){
    return res.status(400).json({message:'add all fields'})
  }

  const problem = { title, description, testCases };
  


  // store the problem in a problems array or database
  // ...
  
  res.json(problem);
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})