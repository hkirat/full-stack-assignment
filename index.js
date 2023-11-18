const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root path
app.get('/', function(req, res) {
  // Send the HTML file when the user is on the root path
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Added Two Users for now
const USERS = [
  {
    email: "admin@example.com",
    password: "password",
    isAdmin: true
  },
  {
    email: "user@example.com",
    password: "password",
    isAdmin: false
  }
];

// Added Two Questions for now
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  title: "Find duplicates",
  description: "Given an array , return the duplicates in the array?",
  testCases: [
    {
      input: "[1,1,2,3,4,5]",
      output: "[1]"
    }
  ]
}
];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    // If user already exists, send a 400 error response to the client
    return res.status(400).send('User already exists');
  } else {
    // If user doesn't exist, add the new user to the USERS array
    USERS.push({ email, password });


  // return back 200 status code to the client
  return res.status(200).send('User created successfully');
}
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email && user.password === password);

  // If the password is the same, return back 200 status code to the client

  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

if (user) {
    // If the password is the same, return back 200 status code to the client
    const token = Math.random().toString(36).substring(2);
    res.status(200).json({ message: 'Login successful', token });
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).json({ message: 'Login failed' });
  }
})

app.get('/questions', function(req, res) {

  const questions = QUESTIONS.map(question => ({
    title: question.title,
    description: question.description
  }));
  //return the user all the questions in the QUESTIONS array
  res.send(questions);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})