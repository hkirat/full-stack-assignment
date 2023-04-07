const express = require('express');
const isAdmin = require('./middlewares/isAdmin');
const AppError = require('./utils/appError');
const errorHandler = require('./utils/errorHandler');
const app = express()
const port = 3001

app.use(express.json());

const USERS = [];

const QUESTIONS = [{
    id: 1, //will be encoded in future
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSIONS = [

]

app.post('/signup', function(req, res, next) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body 
  if(!email || !password) {
    return next(new AppError('Missing Fields', 400, 'error'));
  }
  
  //check if user exists with email
  if(USERS.find(e => e.email === email))return next(new AppError('User already exists', 409, 'error'));

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email, password, });

  // return back 200 status code to the client
  return res.status(201).json({status:'success', message:"user created successfully"});
})

app.post('/login', function(req, res, next) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body 
  if(!email || !password) {
    return next(new AppError('Missing Fields', 400, 'error'));
  }
  
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if(!USERS.find(e => e.email === email && e.password === password))return next(new AppError('Invalid credentials', 401, 'error'));

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  return res.status(200).json({
    status: 'success',
    message: 'login successful',
    token: "some-random-string-token"
  })
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({
    status: 'success',
    questions: QUESTIONS
  })
})

app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
  res.status(200).json({
    status: 'success',
    submissions: SUBMISSIONS
  })
});


app.post("/submissions", function(req, res, next) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { questionId, solution } = req.body;

   if (!questionId || !solution) return next(new AppError('Missing Fields', 400, 'error'));

   if(!QUESTIONS.find((q) => q.id == questionId)) return next(new AppError('Question not found', 401, 'error'));
 
   const isAccepted = Math.random() >= 0.5;
 
   // Add the submission to the array
   SUBMISSIONS.push({
    questionId,
     solution,
     isAccepted,
     createdAt: new Date()
   });
 
   // Return a response with the status and the submission ID
   return res.status(201).json({
     message: "Submission created successfully",
     id: questionId
   });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/question', isAdmin, function(req, res, next) {
  const {title, description, testCases} = req.body;
  if (!title || !description || !testCases)  return next(new AppError('Missing Fields', 400, 'error'));
  const newQuestion = {
    id: QUESTIONS.length + 1,
    title,
    description,
    testCases,
  };
  QUESTIONS.push(newQuestion);
  res.status(201).json({status:'success', message:'Question added successfully'});
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})