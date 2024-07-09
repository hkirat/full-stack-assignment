const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');



const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'frontend')));

const USERS = [];
//serve for signup page
app.get('/signup',function(req,res){
  res.sendFile(path.join(__dirname,'frontend','index.html'));
});

// Serve the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
});

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if the email already exists in the USERS array
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    return res.status(400).send('User with this email already exists');
  } else {
    // Store the new user
    USERS.push({ email, password });

    // Return back 200 status code to the client
    res.status(200).json({ message: 'User registered successfully', redirect: '/dashboard' });
  }
  
});


app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
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


// Route to Get All Users:
app.get('/users', (req, res) => { res.json(USERS); });
//  This route returns the contents of the USERS array in JSON format.
// You can access this route by navigating to http://localhost:3000/users in your browser.


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})