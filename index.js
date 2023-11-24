require('dotenv').config('./.env');
const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [];


const SUBMISSION = [

]

app.use(express.json());
app.post('/signup', function (req, res) {

  // Add logic to decode body
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  }
  // body should have email and password
  const exists = USERS.some(user => user.email === email);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!exists) {
    USERS.push({
      email,
      password,
      isAdmin: false
    })
    res.status(200).send("User created successfully");
  }
  else {
    res.status(400).send("User already exists");
  }


})

app.post('/login', async function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password
  const user = USERS.find(user => user.email === email && user.password === password);


  const token = jwt.sign({ email:email }, process.env.JWT_KEY);


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (user) {
    res.status(200).send({
      message: "Login successful",
      token: token,
      user
    });
  }
  else {
    res.status(401).send("Invalid credentials");
  }
})

app.get('/questions', function (req, res) {
  res.status(200).json(QUESTIONS);
  //return the user all the questions in the QUESTIONS array
  
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
 
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  let isAccepted = Math.random() > 0.5;

  // Store the submission in the SUBMISSION array above
  SUBMISSION.push({
    ...req.body,
    isAccepted
  })
  res.status(200).json({
    message: isAccepted ? "Accepted" : "Rejected"
  });
});

app.use((req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token" });
  }
});


app.post("/setAdmin", function (req, res) {
  const token = req.header("Authorization");

  try {
    // Verify the token and extract the user's email
    const { email } = jwt.verify(token, process.env.JWT_KEY);

    // Find the user in the USERS array
    const user = USERS.find(user => user.email === email);

    // If the user is found, set isAdmin to true and send a success response
    if (user) {
      user.isAdmin = true;
      res.status(200).json({
        message: "Admin set",
        user
      });
    } else {
      // If the user is not found, send a 404 Not Found status code
      res.status(404).json({
        message: "User not found"
      });
    }
  } catch (error) {
    // If verification fails, send a 401 Unauthorized status code
    res.status(401).json({
      message: "Unauthorized"
    });
  }
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/admin/questions", function (req, res) {
  // Extract the token from the request header
  const token = req.header("Authorization");

  try {
    // Verify the token and extract the user's email
    const { email } = jwt.verify(token, process.env.JWT_KEY);

    // Find the user in the USERS array
    const user = USERS.find(user => user.email === email);
    // Check if the user is an admin
    if (user.isAdmin) {
      // Add the new problem to the QUESTIONS array
      const { problem } = req.body;
      QUESTIONS.push(problem);
      res.status(200).json({
        message: "Problem added successfully",
        questions: QUESTIONS  // return all the questions
      });
    } else {
      // If the user is not an admin, send a 401 Unauthorized status code
      res.status(401).json({
        message: "Unauthorized . Only admins can add problems"
      });
    }
  } catch (error) {
    // If verification fails, send a 401 Unauthorized status code
    res.status(401).json({
      message: "Unauthorized"
    });
  }
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})

// {
//   "title": "palindrome",
//   "description": "Given an number , check if the number is palindrome or not?",
//   "testCases": [{
//     "input": 121,
//     "output": true
//   },
//   {
//     "input": 122,
//     "output": false
//   }
//   ]
// }