const express = require('express')
const app = express()
const port = 3001

// parse req.body
var bodyParser = require('body-parser')
app.use(bodyParser.json())

const USERS = [
  {
    id: '1',
    email: 'harkirat96@gmail.com',
    password: 'iLovePizza',
    type: 1  // type 1 is an admin, 2 is a user
  },
  {
    id: '2',
    email: 'hello@kaustubh.app',
    password: 'iLovePizzaToo',
    type: 2
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

const SUBMISSIONS = [
  {
    problemId : '1',
    solution: 'code',
    isAccepted: true
  }
]

// Route for user sign up
app.post('/signup', function(req, res) {
  // Destructure email and password    
  //TODO: add a middleware to validate input and input type

  const { email, password, type } = req.body;

  // Check if user with given email already exists
  const userExists = USERS.some(user => user.email === email);

  if (!userExists) {
    // Store user email and password in USERS array
    USERS.push({ 
      id: (USERS.length + 1).toString(),
      email, password, type 
    });

    // Return success response
    res.status(200).send({msg: "User created successfully!", USERS});
  } else {
    // Return error response
    res.status(409).send('User already exists!');
  }
})

// Route for user login
app.post('/login', function(req, res) {
  // Decode request body which should contain email and password
  const { email, password } = req.body;

  // Find user with given email in USERS array
  const user = USERS.find(user => user.email === email);

  if (user && user.password === password) {
    // Return success response with token
    res.status(200).send({ token: 'randomTokenString' });
  } else {
    // Return error response. no need to send 'User does not exist' - irrelevant
    res.status(401).send('Invalid email or password!');
  }
})

// Route to get all questions
app.get('/questions', function(req, res) {
  // Return all questions in QUESTIONS array
  res.status(200).send(QUESTIONS);
})

// Route to get user submissions for a problem
app.get('/submissions/:problemId', function(req, res) {
  // Get problemId from URL params
  const problemId = req.params.problemId;

  // Filter submissions for given problemId
  const submissions = SUBMISSIONS.filter(submission => submission.problemId === problemId);

  // Return submissions
  res.status(200).send(submissions);
});

// Route to submit a solution for a problem
app.post('/submissions', function(req, res) {
  // Get problemId from URL params
  const {problemId, solution} = req.body

  // Generate random boolean to simulate acceptance or rejection of solution
  const isAccepted = Math.random() >= 0.5;

  const submission = {
    problemId: problemId,
    solution: solution,
    isAccepted
  }
  // Add submission to SUBMISSIONS array
  SUBMISSIONS.push(submission);

  // Return success response
  res.status(200).send({msg: `Submission ${isAccepted ? 'passed all test cases' : 'failed to pass test cases'}`,});
});

// Route to add a new problem (only for admins)
app.post('/questions', function(req, res) {
  // Check if user is admin (e.g. by checking their JWT token). 
  // we'll check the id in USERS array for now (bad idea)

  const {userId, title, description, testCases} = req.body

  // TODO: add AUTH0 functionality to check the request headers and validate user
  // for now, just check if the userId exists
  const user = USERS.find(user => user.id === userId);

  if(user && user.type === 1){
    // If user is admin, add new problem to QUESTIONS array
    const newProblem = {
      title,
      description,
      testCases
    };
    QUESTIONS.push(newProblem);

    // Return success response
    res.status(200).send('Problem created successfully!');
  }else{
    // Return error response
    res.status(403).send('User not authorized to add problem statements');
  }

});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
