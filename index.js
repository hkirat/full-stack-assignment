const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

app.use(bodyParser.json())

const USERS = [];

const QUESTIONS = [{
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [{
  id: 1,
  code: "Sample code",
  questionId: 1,
  isAccepted: true
},
{
  id: 2,
  code: "Sample code 2",
  questionId: 1,
  isAccepted: false
},
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const input = req.body;

  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(checkUserExist(input))
  {
    res.status(405).send('User already exists')
    return;
  }


  const email = input.email;
  const password = input.password;

  USERS.push({email , password});

  // return back 200 status code to the client
  res.status(201).send('User successfully created')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const input = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if(!checkUserExist(input)) 
  {
    res.status(405).send('User does not exist')
    return;    
  }

  // If the password is the same, return back 200 status code to the client
  if(!isUserAuthenticated(input)) {
    res.status(401).send('User unauthorized');
    return;
  }

  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.status(200).json({response: 'success', token: '12312sdfsdf'});
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions/:id", function(req, res) {
   // return the users submissions for this problem

  const id = +req.params.id;
  const response = SUBMISSION.filter(item => +item.questionId === id);

  res.status(200).json(response);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

  const input = req.body;
  input.id = SUBMISSION.length + 1;
  input.isAccepted = Math.random() > 0.5;

  SUBMISSION.push(input);

  res.status(200).send("Submission submitted successfully");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/questions', (req, res) => {
  const token = req.headers.token;
  if(token !== 'admin')
  {
    res.status(405).send('Unauthorized user');
    return;
  }

  const input = req.body;
  input.id = QUESTIONS.length + 1;
  QUESTIONS.push(input);
  res.status(201).send('Question added successfully');
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

const checkUserExist = (user) => {
  const index = USERS.findIndex(item => user.email === item.email);
  return index > -1;
}

const isUserAuthenticated = (user) => {
  const index = USERS.findIndex(item => user.email === item.email && user.password === item.password);
  return index > -1;
}