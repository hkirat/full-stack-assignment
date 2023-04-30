const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const dotEnv = require('dotenv');
const winston = require('winston');
const crypto = require('crypto');
const {requiredParamsValidator, verifyAccessToken} = require('./validationMiddleware');
const { sendConfirmationEmail } = require('./email');
const { verifyConfirmationToken, generateAccessToken, getQuestions } = require('./utils');
const SUBMISSIONS = require('./submissions');

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

const users = [];
const confirmationTokens = [];

const SUBMISSION = [

]

app.get('/confirm-email', async (req, res) => {
  const { email, token, expires } = req.query;

  // when user clicks confirmation link, verify token
  const verified = verifyConfirmationToken(confirmationTokens, email, `${token}:${expires}`);
  if (!verified) {
    return res.status(401).json({ error: 'Unauthorized: Authentication failed or user lacks necessary privileges.' });
  }
  // Check if the confirmation token has expired
  if (parseInt(expires) < Date.now()) {
    return res.status(401).json({ error: 'Unauthorized: The confirmation link has expired.' });
  }
  // Look up user by email and mark as confirmed
  const index = users.findIndex((user) => user.email == email);
  users[index].confirmed = true;

  return res.status(200).json({message: 'Your email address has been confirmed. You can now sign in.'});
});

app.post('/signup', limiter, requiredParamsValidator, async (req, res) => {
  const { email, password } = req.validatedData;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user with given email already exists in the users array
  const userExists = users.some(user => user.email === email);

  // If user already exists, send back a 409 Conflict status code with an error message
  if (userExists) {
    return res.status(409).json({ error: 'User with given email already exists' });
  }

  // Otherwise, create a new user object with email and hashed password properties
  const newUser = { email, password: hashedPassword, confirmed: false};

  // Store the new user object in the users array
  users.push(newUser);

  // Generate a confirmation token using crypto.randomBytes
  const confirmationToken = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 3 * 60 * 1000; // 3 minutes from now
  const token = `${confirmationToken}:${expiry}`;

  // Save the confirmation token and user information in a confirmationTokens array
  confirmationTokens.push({ email, password, token });

  // Send a confirmation email to the user
  await sendConfirmationEmail(email, token);

  // Return a success message to the client
  res.status(200).json({ message: 'Confirmation email sent' });
});



app.post('/login', limiter, requiredParamsValidator, (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body; // Extract email and password fields from request body

  // Check if the user with the given email exists in the users array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  let foundIndex;
  const found = users.some((item, index) => {
      foundIndex = index;
      return item.email === email;
  });
  if (found) {
    const foundUser = users[foundIndex];
    bcrypt.compare(password, foundUser.password, (err, isMatch) => {
      if (err) {
        // Handle error
          res.status(500).json({ message: 'Internal server error' });
      } else if (isMatch) {
        // Passwords match
        if (foundUser.confirmed) {
          // Generate a JWT access token with the user's email as the payload
          const accessToken = generateAccessToken(foundUser.email);
          // Set the access token as an HTTP-only cookie
          res.cookie('access_token', accessToken, { httpOnly: true });
          // Return a success message to the client
          res.status(200).json({ message: 'Logged in successfully' });
        }else{
          return res.status(401).json({ message: 'Email address has not been confirmed' });
        }
      } else {
        // Passwords do not match
        res.status(401).json({message: 'Incorrect password'});
      }
    });
  }else{
    return res.status(401).json({ message: 'Invalid credentials or user not found.' });
  }
});

app.get('/questions', limiter, verifyAccessToken, (req, res) => {
  //return the user all the questions in the QUESTIONS array
  const { page = 1, limit = 5, sort = 'createdAt' } = req.query;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const sortedQuestions = getQuestions().sort((a, b) => {
    if (sort === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sort === 'likes') {
      return b.likes - a.likes;
    } else if (sort === 'dislikes'){
      return a.dislikes - b.dislikes;
    }else{
      return 0;
    }
  });

  const paginatedQuestions = sortedQuestions.slice(startIndex, endIndex);

  res.status(200).json(paginatedQuestions);
})

app.get("/submissions", limiter, verifyAccessToken, (req, res) => {
  const { questionId } = req.query;
  let userSubmissions = [];

  // If questionId is not provided, return all user submissions
  // If questionId is provided, return the user's submissions for that question
  if (!questionId) {
    userSubmissions = SUBMISSIONS.filter((submission) => submission.userId === req.user);
  }else{
    userSubmissions = SUBMISSIONS.filter((submission) => submission.userId === req.user && submission.questionId === parseInt(questionId));
  }
  return res.status(200).json(userSubmissions);
});

app.post("/submissions", (req, res) => {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})