const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const USERS = [
  { email: 'admin@example.com', password: 'adminpassword', role: 'admin' },
  { email: 'user@example.com', password: 'userpassword', role: 'user' }
];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSIONS = [

]

// Function to generate a random number within a specific range
function getRandomNumber(min, max) {
  // Add 1 to the difference between max and min, because Math.random() generates a number between 0 (inclusive) and 1 (exclusive)
  // Multiply the result by the difference between max and min, and then round down to the nearest integer using Math.floor()
  // Finally, add min to the result to shift the range to start from min instead of 0
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create a token
function createToken(user) {
  // Define the payload for the token
  const payload = {
    email: user.email, // Replace with the actual user email
    role: user.role
  };

  // Sign the token with a secret key and set an expiration time
  const token = jwt.sign(payload, 'SECRET_KEY', { expiresIn: '1h' });
  return token;
} 

// Middleware function for authenticating user and verifying token
function authenticateUser(req, res, next) {
  // Extract the token from the request header or query parameter or cookies, etc.
  const authHeader = req.headers.authorization;
  if(authHeader)
  {
    const token = authHeader && authHeader.split(' ')[1]; 
    // Verify the token using jsonwebtoken library
    // Replace 'SECRET_KEY' with your own secret key used for token generation
    jwt.verify(token, 'SECRET_KEY', function(err, decoded) {
      if (err) {
        // If token verification fails, return an appropriate response
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        // If token verification succeeds, set the authenticated user in the request object and call the next middleware
        req.user = decoded; // Assuming the user object is stored in the 'user' property of the token payload
        next();
      }
    });
  }
  else{
    res.status(403).json({ message: 'Forbidden' });
  }
  
}

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const newUser = { email, password };
  USERS.push(newUser);

  // return back 200 status code to the client
  res.status(200).json({ message: 'User signed up successfully' });
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  // Check if email and password are present in the request body
  if (!email || !password) {
    // If email or password is missing, return 400 status code (Bad Request)
    return res.status(400).json({ message: 'Email and password are required' });
  }
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  if (user) {
    // If user exists, check if the password matches
    if (user.password === password) {
      // If password matches, return 200 status code and send back a token
      // You can generate a token using a library like jsonwebtoken
      const token = createToken(user); // Replace with actual token generation logic
      res.status(200).json({ token });
    } else {
      // If password does not match, return 401 status code (Unauthorized)
      res.status(401).json({ message: 'Invalid password' });
    }
  } else{
    // If user does not exist, return 401 status code (Unauthorized)
    res.status(401).send({ message: 'Invalid email' });
  }

});

app.get('/questions', authenticateUser, function(req, res) {
  // Retrieve the authenticated user from the request object
  const user = req.user;

  if (user) {
    // Return the questions in the QUESTIONS array
    res.send(QUESTIONS);
  } else {
    // If the user does not have access, return an appropriate response
    res.status(403).json({ message: 'Forbidden' });
  }
});

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

module.exports = {
  app,
  USERS,
  QUESTIONS
};