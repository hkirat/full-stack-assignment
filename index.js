const express = require('express');
const cors = require('cors')
const {
  getQuestions, addQuestion, getQuestionBySlug
} = require('./controllers/questions');
const { register, login } = require('./controllers/auth');
const { getSubmissionsByUserIdQuestionId, addSubmission } = require('./controllers/submissions');
const app = express();
const port = 3001;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
})

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors({
  origin: "http://localhost:5173",
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

app.post('/api/signup', register);

app.post('/api/login', login)

app.get('/api/questions', getQuestions);

app.post('/api/question', getQuestionBySlug);

// leaving as hard todos
app.post('/api/questions', addQuestion);

app.get("/api/submissions", getSubmissionsByUserIdQuestionId);

app.post("/api/submissions", addSubmission);


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})