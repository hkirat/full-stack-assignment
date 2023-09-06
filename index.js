const express = require('express');
const app = express();
const port = 3001 || process.env.PORT;

app.use(express.json());

const USERS = [];
const LOGIN = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.get('/', (req,res) => {
    res.send("this is home page for login and signup");
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;

  //existing user
  const existingUser = USERS.find(user => user.email === email);
  if(existingUser){
    return res.status(400).json({message:"user already exists"});
  }
  
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email, password, isAdmin});


  // return back 200 status code to the client
  res.status(200).json({message:"user registered successfully"});
  console.log(USERS);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;
  const isAdmin = USERS.find(user => user.email === email && user.isAdmin);

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const existingUser = USERS.find(user => user.email === email && user.password === password);

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if(existingUser){
    LOGIN.push({email, password, isAdmin});
    return res.status(200).json({message:"user logged in successfully"});
  }
  else{
    return res.status(401).json({message:"user does not exist or invalid credentials"});
  }


})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

   const body = {
    solution : req.body.solution,
    isCorrect : Math.random() > 0.5
  }

   if(body["isCorrect"]){
    res.status(200).json({message:"correct solution"});
   }
   else{
    res.status(400).json({message:"incorrect solution"});
   }
   SUBMISSION.push(body);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin/addProblem", (req, res) => {
  // Add logic to decode body
  // body should have title, description and testCases
  const title = req.body.title;
  const description = req.body.description;
  const testCases = req.body.testCases;


  //existing problem
  const existingProblem = QUESTIONS.find(problem => problem.title === title);

  if(existingProblem){
    return res.status(400).json({message:"problem already exists"});
  }

  const isAdmin = LOGIN.find(user => user.isAdmin);

  if(isAdmin){
    QUESTIONS.push({title, description, testCases});
    res.status(200).json({message:"problem added successfully"});
  }
  else{
    res.status(401).json({message:"only admin can add problems"});
  }
  
  //Store title, description and testCases (as is for now) in the QUESTIONS array above (only if the problem with the given title doesnt exist)
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
})