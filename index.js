const express = require("express")
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express()
const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const USERS = [
  { email: "user1@example.com", password: "$2a$10$6T9IddFYifO6Q2A6RJlze.lZw46EIQq6UaJ6F0dihX.yPKJ7Vq3vO" }, // password: "password1"
  { email: "user2@example.com", password: "$2a$10$VOWFvAk8x7/xJUpzBYhZDOd5Zzv5r5Wemtzk1fY2/SvzZP75WOrjG" } // password: "password2"
];

const QUESTIONS = [
  { 
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        "input": "[1,2,3,4,5]",
        "expected_output": "5"
    }]
  },
  {
    id: 2,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    testCases: [
        {
            "input": "[2,7,11,15], 9",
            "expected_output": "[0,1]"
        },
        {
            "input": "[3,2,4], 6",
            "expected_output": "[1,2]"
        },
        {
            "input": "[3,3], 6",
            "expected_output": "[0,1]"
        }
    ]
  },
  {
    id: 3,
    title: "Merge Two Sorted Arrays",
    description: "Given two sorted integer arrays nums1 and nums2, merge nums2 into nums1 as one sorted array.\n\nThe number of elements initialized in nums1 and nums2 are m and n respectively. You may assume that nums1 has a size equal to m + n such that it has enough space to hold additional elements from nums2.\n\nExample 1:\n\nInput:\nnums1 = [1,2,3,0,0,0], m = 3\nnums2 = [2,5,6],       n = 3\nOutput: [1,2,2,3,5,6]\n\nExample 2:\n\nInput:\nnums1 = [1], m = 1\nnums2 = [],       n = 0\nOutput: [1]",
    testCases: [
      {
        "input": {
          "nums1": [1, 2, 3, 0, 0, 0],
          "m": 3,
          "nums2": [2, 5, 6],
          "n": 3
        },
        "output": [1, 2, 2, 3, 5, 6]
      },
      {
        "input": {
          "nums1": [1],
          "m": 1,
          "nums2": [],
          "n": 0
        },
        "output": [1]
      },
      {
        "input": {
          "nums1": [0],
          "m": 0,
          "nums2": [1],
          "n": 1
        },
        "output": [1]
      }
    ]
  },
  // add more questions here

];


const prevSUBMISSIONS = require('./submissions'); // Assuming that there is a separate module/file for the submissions array


const SUBMISSION = [

]

const PROBLEMS = [

]


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//signup route
app.post('/signup', async (req, res) => {


  // Add logic to decode body*
  // body should have email and password*


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)*


  // return back 200 status code to the client*

  try {
    const { email, password, role } = req.body; // role to let user choose between admin and normal user

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if user already exists
    const userExists = USERS.find((user) => user.email === email);
    if (userExists) {
      return res.status(409).send("User already exists");
    }

    // add the new user to the USERS array
    USERS.push({ email, password });

    res.status(200).send("Signup successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
  
});

// login route
app.post("/login", async (req, res) => {


  // Add logic to decode body*
  // body should have email and password*

  // Check if the user with the given email exists in the USERS array*
  // Also ensure that the password is the same*


  // If the password is the same, return back 200 status code to the client*
  // Also send back a token (any random string will do for now)*
  // If the password is not the same, return back 401 status code to the client*

  const { email, password } = req.body;

  // find the user with the given email
  const user = USERS.find((user) => user.email === email);

  if (!user) {
    // if user is not found, return a 401 status code (Unauthorized)
    return res.status(401).send("Invalid email or password");
  }

  // check if the password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    // if password is incorrect, return a 401 status code (Unauthorized)
    return res.status(401).send("Invalid email or password");
  }

  // if email and password are correct, create and send a JWT token
  const token = jwt.sign({ email }, "secret");
  res.status(200).json({ token });
});


// route to get all Coding questions
app.get('/questions', (req, res) => {
  const codingQuestions = QUESTIONS.filter((question) => question.title.includes('Coding'));
  res.json(codingQuestions);
});

// route for all previous submission
app.get('/submissions/:userId/:problemId', (req, res) => {
  // return all users submissions for this problem*

  const userId = req.params.userId;
  const problemId = req.params.problemId;
  const userSubmissions = prevSUBMISSIONS.filter(submission => submission.userId === userId && submission.problemId === problemId);
  res.json(userSubmissions);
});

// route for current user submission
app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution*
   // Store the submission in the SUBMISSION array above*

  const submission = req.body; // assuming the submission object has a problem and solution field

  // randomly accept or reject submission
  const isAccepted = Math.random() >= 0.5;

  submission.isAccepted = isAccepted;

  SUBMISSIONS.push(submission);

  res.json({
    message: `Your submission has been ${isAccepted ? 'accepted' : 'rejected'}`,
  });
});

// leaving as hard todos*

// Create a route that lets an admin add a new problem*
// ensure that only admins can do that.*

// function to check if the user is an admin
const isAdmin = (req, res, next) => {
  const { email } = req.body;
  const user = USERS.find(user => user.email === email);
  if (!user || user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }
  next();
};

// Define an endpoint to handle POST requests to /problems
app.post('/problems', isAdmin, (req, res) => {
  const { title, description, testCases } = req.body;

  // Create a new problem object
  const newProblem = {
    id: PROBLEMS.length + 1,
    title,
    description,
    testCases
  };

  // Add the new problem to the problems array
  PROBLEMS.push(newProblem);

  // Send a response indicating success
  res.status(201).send('Problem created successfully');
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})