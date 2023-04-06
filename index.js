const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');


// Add body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  const { email, password } = req.body;

  // body should have email and password

  if (!email || !password) {
    return res.status(400).send('Email and password are required fields.');
  }
  USERS.push({email, password});


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  USERS.push({email, password});

  // return back 200 status code to the client
  res.status(200).send('User registered successfully!');

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;


  
   // Check if email and password fields are present in the request body
   if (!email || !password) {
    return res.status(400).send('Email and password are required fields.');
  }

   // Find the user with the given email in the USERS array
   const user = USERS.find(user => user.email === email);

  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now) 
  // If the password is not the same, return back 401 status code to the client

   // Check if user exists and password matches
   if (user && user.password === password) {
    // Generate a random token (for demonstration purposes)
    const token = Math.random().toString(36).substring(2);

    // Send success response with 200 status code and token
    res.status(200).json({ token, message: 'Login successful!' });
  } else {
    // Send error response with 401 status code for unauthorized access
    res.status(401).send('Invalid email or password.');
  }


  
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
});

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const userId = req.headers['user-id'];
  const userSubmissions = SUBMISSION.filter(submission => submission.userId === userId);
  res.status(200).json(userSubmissions);
  
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const {questionId, solution} = req.body;
   const userId = req.headers['user-id'];
   const isAccepted = Math.random() >= 0.5;

   SUBMISSION.push({userId, questionId, solution, isAccepted});

   // Return success message
   res.status(200).send('Submission received');

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/add-problems", function (req, res) {
  // Logic to decode body
  const { title, description, testCases } = req.body;

  // Checking that only admins can do that.
  const userRole = req.headers['user-role'];
    if (userRole !== 'admin') {
        return res.status(403).send('Only admins can add problems');
    }

  // Store the problem in QUESTIONS array
  const problem = { title, description, testCases };
  QUESTIONS.push(problem);

  // Send back a HTTP response to the client
  res.status(200).json({ message: "Problem added", problem });
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});