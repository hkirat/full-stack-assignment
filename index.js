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
  const {email, password} = req.body;
  // body should have email and password
  if(!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email, password});

  // return back 200 status code to the client
  return res.status(200).json({message: "User created successfully"});
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password} = req.body;
  // body should have email and password
  if(!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  USERS.find((user) => {
    if(user.email !== email) {
      return res.status(401).send("Invalid email");
    }
  });

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)

  USERS.find((user) => {
    if(user.password === password) {
      return res.status(200).json({
        token:'fhauifgsc8afa',
        message: "User logged in successfully"
      })
    }
  });

  // If the password is not the same, return back 401 status code to the client
  return res.status(401).send("Invalid password");


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const {email}=req.body
    // Get user's submissions based on their authentication token
    const userSubmissions = SUBMISSIONS.filter(submission => submission.email === email);
  
    res.status(200).json(userSubmissions);
    res.send("Hello World from route 4!");
  });
  



app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { problemId, solution,email} = req.body;

   // Randomly accept or reject the solution
   const isAccepted = Math.random() < 0.5;
 
   // Store the submission in the SUBMISSIONS array
   SUBMISSIONS.push({ problemId, solution, isAccepted, email });
 
   res.sendStatus(200);

  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

function isAdmin(req, res, next) {
  // Implement your admin check logic here
  const isAdmin = true; // Example: Assuming the user is an admin

  if (!isAdmin) {
    return res.status(403).send('Access denied.');
  }

  next();
}

// Route for admin to add a new problem
app.post('/problems', isAdmin, function(req, res) {
  const newProblem = req.body;

  // Add the new problem to the QUESTIONS array
  QUESTIONS.push(newProblem);

  res.sendStatus(200);
});


const Port= 3000;

app.listen(Port, function() {
  console.log(`Example app listening on Port ${Port}`)
})