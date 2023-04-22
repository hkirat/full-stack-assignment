const express = require('express');
const {
  getQuestions, addQuestion
} = require('./controllers/questions');
const { register, login } = require('./controllers/auth');
const { getSubmissionsByUserIdQuestionId, addSubmission } = require('./controllers/submissions');
const app = express();
const port = 3001;



app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

// Route to render Pages
// Signup Page
app.get('/signup', (req, res) => {
  res.sendFile(`${__dirname}/pages/signup.html`)
});

// Login Page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/pages/login.html`)
})

app.post('/signup', register);

app.post('/login', login)

app.get('/questions', getQuestions);
// leaving as hard todos
app.post('/questions', addQuestion);

app.get("/submissions", getSubmissionsByUserIdQuestionId);

app.post("/submissions", addSubmission);


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})