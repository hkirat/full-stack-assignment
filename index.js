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
     // body should have email and password
     const { email, password } = req.body;

     // Check if user with given email already exists in the USERS array
     const existingUser = USERS.find(user => user.email === email);
     if (existingUser) {
       return res.status(409).send('User with that email already exists');
     }
   
     //Store email and password (as is for now) in the USERS array above
     USERS.push({ email, password });
   
     // return back 200 status code to the client
     res.status(200).send('User created successfully');
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = Math.random().toString(36).substr(2);
  res.status(200).json({ token });

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
     // Let the user submit a problem
     const { problem, solution } = req.body;
     
     // Randomly accept or reject the solution
     const isAccepted = Math.random() < 0.5;
   
     // Store the submission in the SUBMISSIONS array above
     SUBMISSIONS.push({ problem, solution, isAccepted });
   
     // Return a response to the client indicating whether the solution was accepted or rejected
     if (isAccepted) {
       res.status(200).send("Solution accepted!");
     } else {
       res.status(400).send("Solution rejected");
     }
});


// Define an array to store the problems
const PROBLEMS = [];

// Define an array to store the admin users
const ADMINS = ["admin@example.com"];

// Define a middleware function to check if the user is an admin
function isAdmin(req, res, next) {
  const { email } = req.body;
  if (ADMINS.includes(email)) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

// Create a route that lets an admin add a new problem
app.post("/problems", isAdmin, function(req, res) {
  // Extract the problem details from the request body
  const { title, description, difficulty } = req.body;

  // Create a new problem object
  const problem = { title, description, difficulty };

  // Add the problem to the PROBLEMS array
  PROBLEMS.push(problem);

  // Send a response back to the client
  res.status(200).send("Problem added successfully");
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})