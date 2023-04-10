const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const dotEnv = require('dotenv');
const winston = require('winston');
const validationMiddleware = require('./validationMiddleware');

// Define rate limiting options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max requests per window : 10
  message: 'Too many requests from this IP, please try again in 5 minutes'
});

// Configure Winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

const app = express()
dotEnv.config();

// Parse JSON bodies for this app
app.use(bodyParser.json())
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({
    error: {
      code: err.code,
      message: err.message,
      stack: err.stack,
    },
  });
});


// Parse URL-encoded bodies for this app
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT;
// Use JWT_SECRET environment variable to sign and verify JWTs
const JWT_SECRET = process.env.JWT_SECRET;

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

app.post('/signup', limiter, validationMiddleware, async (req, res) => {
  const { email, password } = req.validatedData;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user with given email already exists in the USERS array
  const userExists = USERS.some(user => user.email === email);

  // If user already exists, send back a 409 Conflict status code with an error message
  if (userExists) {
    return res.status(409).json({ error: 'User with given email already exists' });
  }

  // Otherwise, create a new user object with email and hashed password properties
  const newUser = { email, password: hashedPassword };

  // Store the new user object in the USERS array
  USERS.push(newUser);

  // Generate a JWT access token with the user's email as the payload
  const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Set the access token as an HTTP-only cookie
  res.cookie('access_token', accessToken, { httpOnly: true });

  // return back 200 status code to the client
  res.sendStatus(200);
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

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})