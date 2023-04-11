const express = require('express')
const app = express()
const port = 3001

const USERS = [];
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const QUESTIONS = [{
  title:"Add two number",
  description: "Given two integers, add them without using addition or subtraction operators",
  testcases: [
    {
      input: "1 2",
      output: "3"
    }
  ]
}];


const SUBMISSION = [];

app.post('/signup', function(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  if (USERS.some(user => user.email === email)) {
    return res.status(409).sendStatus("User already exists");
  }
  USERS.push({email,password});
  return res.status(200).sendStatus("You are signed up successfully");
})

app.post('/login', function(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  const user = USERS.find(user => user.email===email);
  if(user && user.password===password) {
    const token = generateRandomString(email.length);
    return res.status(200).sendStatus("You are logged in successfully " + token);
  }
  else {
    return res.status(401).sendStatus("Email or password is incorrect for the user")
  }
})

app.get('/questions', function(req, res) {
    res.sendStatus(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  const questionTitle = req.params.title;
  const submissions = SUBMISSION.filter(submission => submission.questionTitle === questionTitle);
  res.status(200).json(submissions);
});


app.post("/submissions", function(req, res) {
  let questionTitle = req.body.title;
  let solution = req.body.solution;
  if(title.length%2==0)
    accepted = true;
  SUBMISSION.push({ questionTitle, solution, accepted });
  res.sendStatus(200).send("Your question is now submitted!!");
  
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})