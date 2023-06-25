const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const app = express()
app.use(express.json());
app.use(cookieParser());
const port = 3001

const USERS = [{
  email: "101amolkadam@gmail.com@gmail.com",
  password: "1234"
}
];

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

  // checking if a session is ongoing
  const token = req.cookies.authToken;
  if (token) {
    res.clearCookie('authToken');
  }

  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const userExists = USERS.some(obj => obj.hasOwnProperty("email") && obj["email"] === email);

  if(userExists) {
    return res.status(400).json({ message: 'Old user please login'});
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email: email, password: password});

  // return back 200 status code to the client
  res.status(200).send("Signup Success");
})

app.post('/login', function(req, res) {
  // checking if a session is ongoing
  const token = req.cookies.authToken;
  if (token) {
    res.clearCookie('authToken');
  }

  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const userExists = USERS.some(obj => obj.hasOwnProperty("email") && obj["email"] === email);

  if(!userExists) {
    return res.status(400).json({ message: 'New user please signup'});
  }

  const passwordMatches = USERS.some(obj => obj.hasOwnProperty("email") && obj["email"] === email && obj["password"] === password);

  if(!passwordMatches) {
    return res.status(401).json({ message: 'Wrong password'});
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const newToken = jwt.sign({ email: email }, 'secretKey');
  res.cookie('authToken', newToken, { httpOnly: true });
  return res.status(200).send("Login Successfull");
})

app.use((req, res, next) => {
  // Extract the token from the cookie
  const token = req.cookies.authToken;
  if (token) {
    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, 'secretKey');
      req.email = decodedToken.email;
      next();
    } catch (err) {
      res.status(401).send("Hmmm.....? Fishy"); // Unauthorized
    }
  } else {
    res.status(401).send("Login"); // Unauthorized
  }
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const email = req.email;
  const submission = req.body.submission;
  const verdict = Math.random() < 0.5;
  SUBMISSION.push({email:email, submission:submission, verdict:verdict});
  res.status(200).send("Submission Successfull");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})