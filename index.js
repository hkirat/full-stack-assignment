const express = require('express');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const app = express();
const port = 3001;

const USERS = [
  {
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    token: "adminToken"
  }
];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5"
      },
      {
      input: "[1,2,3,4,5]",
      output: "5"
      }
    ]
  }
];


const SUBMISSION = [];

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Token authentication middleware
const authenticateToken = (req, res, next) => {

  // Retrieve the token from the request headers or cookies
  const token = req.headers.authorization || req.cookies.token || req.body.token;

  if (!token) {
    // Token not found, return an unauthorized response
    return res.status(401).send('Unauthorized');
  }
  const userToken = USERS.find(user => user.token === token);

  if (!userToken) {
    return res.status(401).send('Unauthorized');
  }

  next();
};

app.post('/signup', function(req, res) {

  //Decode request body and extract email and password
  const {email, password} = req.body;

  //Check if the user already exists in the USER array
  const existingUser = USERS.find(user => user.email === email);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (existingUser) {
    res.status(409).send('User already exists');
  }
  else {
    // Also send back a token (any random string will do for now)
    const randomNum = Math.floor(Math.random() * 1000);

    const token = email + randomNum;

    // Set the token as an HTTP cookie
    res.cookie('token', token, { httpOnly: true});

    //user details added to USER array
    const newUser = {
      email,
      password,
      role: "user",
      token // Assign the token to the user object
    };

    USERS.push(newUser);
    console.log(newUser);

    // return back 200 status code to the client
    res.status(200).send('Signup Successful');
  }
})

app.post('/login', authenticateToken, function(req, res) {

  //Decode request body and extract email and password
  const {email, password} = req.body;

  // Find the user with the given email
  const user = USERS.find(user => user.email === email);

  //to store admin token in browser cookies
  if (user.token === "adminToken") {
    res.cookie('token', token, { httpOnly: true});
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if(user && password === user.password) {

    res.status(200).send('Login Successful');
  }
  else {
    res.status(401).send('Unauthorized');
  }

})

app.get('/questions', authenticateToken, function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions", authenticateToken, function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION);
});


app.post("/submissions", authenticateToken, function(req, res) {
  // Extract the submitted problem solution from the request body
  const { problemSolution } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5; // Randomly generate a boolean value

  // Create a new submission object
  const submission = {
    problemSolution,
    isAccepted
  };

  // Store the submission in the SUBMISSION array
  SUBMISSION.push(submission);

  // Return a response indicating the status of the submission
  if (isAccepted) {
    res.status(200).send("Submission accepted");
  } else {
    res.status(400).send("Submission rejected");
  }

});

// leaving as hard todos

// Create a route that lets an admin add a new problem
app.post('/questions/add', authenticateToken, function(req, res) {
  
  const token = req.headers.authorization || req.cookies.token;
  const user = USERS.find(user => user.token === token);
  // ensure that only admins can do that.
  if (user.role !== 'admin') {
    return res.status(401).send('Unauthorized');
  }

  else {
    // Extract the new problem details from the request body
    const { title, description, testCases } = req.body;

    // Create a new problem object
    const newProblem = {
      title,
      description,
      testCases
    };

    // Add the new problem to the QUESTIONS array
    QUESTIONS.push(newProblem);

    res.status(200).send('Problem added successfully');
  }

});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})