const express = require('express')
const app = express()
const port = 3000

const USERS = []; 
const QUESTIONS = [];
const SUBMISSIONS = [];

// Signup page//
app.post('/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if(!email || !password){
    res.status(400).send('Enter valid email or password.');
    return;
  }
  if(USERS.some((user)=>user.email===email)){
    res.status(400).send('User already exists');
    return;
  }
  USERS.push({'email': email,'password':password});
  res.status(200).send('User succesfully registered');

})
//Login page//

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if(!email || !password){
    res.status(400).send('Enter valid email or password');
    return;
  }
  const isUser = USERS.some(user=>user.email===email);
  if(isUser && USERS.some(user=>user.password===password)){
    res.status(200).send('User Login Succesful');
    res.send('bhdgfjdshjhghgf');
    return;
  }else{
    res.status(401).send('Invalid email or password');
  }
  
})

//Questions Page//

app.get('/questions', (req, res) => {
  res.send(QUESTIONS);
})

//Submissions Page//

app.get('/submissions', (req, res) => {
  res.send(SUBMISSIONS);
})

//Submission Page//

app.post('/submission', (req, res) => {
  const submission = req.body.submission;
  const number = Math.floor(Math.random()*2);
  if(number == 0){
    res.send('Solution Accepted');
  }else{
    res.send('Solution Rejected');
  }
  SUBMISSIONS.push(submission);

})

//Add problems by admins only//

app.post('/add-a-problem', (req, res) => {
  if(USERS.some(user=>user.isAdmin)){
    const problem = req.body.problem;
    QUESTIONS.push(problem);
    res.status(200).send('Problem succesfully added');
    return;
  }else{
    res.status(401).send('Only admins can add problems')
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})