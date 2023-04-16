const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [
  {
    questionId: "1",
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases:
      [{
        input: "[1,2,3,4,5]",
        output: "5"
      }]
  },
  {
    id: 2,
    title: "Array sum",
    description: "Given an array, return the sum of its elements?",
    testCases:
      [{
        input: "[1,2,3,4,5]",
        output: "15"
      }]
  }
];


const SUBMISSION = []

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //check if user already exists
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({ email, password });

  // return back 200 status code to the client
  res.sendStatus(200);
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const user = USERS.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.sendStatus(401).json({ error: 'Invalid email or password' });
  }

  const token = Math.random().toString(36).substring(2);
  res.sendStatus(200).json({ token });

})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.Status(200).json(QUESTIONS);
})

app.get("/submissions/:questionId", function (req, res) {
  // return the users submissions for this problem
  const { questionId } = req.params;
  const validQuestionId = QUESTIONS.find(qid => QUESTIONS.questionId ===  questionId);
  if(!validQuestionId){
    return res.sendStatus(400).json({ error: 'Invalid QuestionId' });
  }
  const submissions = SUBMISSION.filter(submission => submission.questionId === questionId);
  res.status(200).json({ submissions });
});


app.post("/submissions/:questionId", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { questionId } = req.params;
  const validQuestionId = QUESTIONS.find(qid => QUESTIONS.questionId ===  questionId);
  if(!validQuestionId){
    return res.sendStatus(400).json({ error: 'Question does not exist' });
  }
  const { answer } = req.body;
  const isAccepted = Math.random() >= 0.5;

  SUBMISSION.push({questionId, answer, isAccepted});
  res.sendStatus(200);
});



// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/problem", function (req, res){
  const { isAdmin } = req.user;

  if(!isAdmin){
    return res.status(401).json({message: 'You are not authorized to add questions'});
  }

  const {title, description, testCases} = req.body;

  const newQuestion = {
    id: uuidv4(),
    title,
    description,
    testCases
  };

  QUESTIONS.push(newQuestion);

  res.status(200).json({message: "New question added successfully"});
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})