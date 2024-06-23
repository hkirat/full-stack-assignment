const express = require('express');
const app = express()
const port = 4000
const { signup, login } = require('./authController');
const { questionList, submit, submission, createProblem } = require('./quesController');

// const USERS = [];

// TO PARSE ENCODED DATA IN BODY
app.use(express.json());

app.get('/',(req,res)=>{
  return res.json({
    message: "Hey! Mom ✨",
    login: '/login',
    signup: '/signup',
    questionList: '/questions',
    checkSubmissions: '/submissions',
    submit: '/submissions',
    createProblem: '/createProblem',
  })
})

app.post('/signup', signup)

app.post('/login', login)

app.get('/questions', questionList)

app.get("/submissions", submission);

app.post("/submissions", submit);

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/createProblem', createProblem);

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})