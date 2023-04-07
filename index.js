const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []
const PROBLEMS = [];

// Serve the sign up form to the client
app.get('/signup', function(res) {
  const html = `
    <form method="POST" action="/signup">
      <label>Email:</label><br>
      <input type="email" name="email"><br>
      <label>Password:</label><br>
      <input type="password" name="password"><br><br>
      <input type="submit" value="Submit">
    </form>
  `;
  res.send(html);
});

// Handle the sign up form submission
app.post('/signup', function(req, res) {
  // Get email and password from the request body
  const { email, password } = req.body;

  // Check if the user already exists
  const userExists = USERS.some(user => user.email === email);
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  // Add the user to the USERS array
  USERS.push({ email, password });

  // Return a success message to the client
  res.status(200).send('User created successfully');
});

// Start the server
app.listen(3000, function() {
  console.log('Server started on port 3000');
});


app.post('/login', function(req, res) {
  // Get email and password from the request body
  const { email, password } = req.body;

  // Find the user with the given email
  const user = USERS.find(user => user.email === email);

  // If user not found, return 401 Unauthorized status code
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // If password doesn't match, return 401 Unauthorized status code
  if (user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  // Generate a random token
  const token = Math.random().toString(36).substr(2);

  // Return success response with the token
  res.status(200).json({ token });
});

// Start the server
app.listen(3000, function() {
  console.log('Server started on port 3000');
});


app.get('/questions', function(req, res) {
  
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

// create a middleware function to check if user is an admin
function checkAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Access denied!");
  }
}

app.use(express.json()); // middleware to parse JSON in request body

app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(req.body);
  const accepted = Math.random() < 0.5;
  res.send(accepted ? "Accepted" : "Rejected");
});

app.post("/problems", checkAdmin, function(req, res) {
  // route for admins to add a new problem
  PROBLEMS.push(req.body);
  res.send("Problem added successfully!");
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
