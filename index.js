const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const express = require('express')
const app = express()
const port = 3001

function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)
  
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,email) =>{
      if (err) return res.sendStatus(403)
      req.email = email
      next()
  })
}  

function getEmailIndex(email) {
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email) {
      return i; 
    }
  }
  return -1; 
}

function isAdmin(email){
for(let i = 0; i < USERS.length; i++) {
  if(USERS[i].email === email) {
    if(USERS[i].role === 'admin') {
      return true;
    }
    else{
      return false;
    }
  }
}
}

function isQuestionExisting(title){
  for(let i = 0; i < QUESTIONS.length; i++) {
    if(QUESTIONS[i].title === title) {
      return true;
    }
  }
  return false;
}

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSION = [

]

app.use(express.json());

app.post('/signup',async (req, res) => {
 var {email, password,role} = req.body;

 if(!email || !password){
  res.status(400).json({status:"INVALID_REQUEST"});
  return;
 }
 const emailIndex=getEmailIndex(email);

 if(!(emailIndex<0)){
  res.status(400).json({status:"USER_EXISTS"});
  return;
 }
 password = await bcrypt.hash(password, 10);
 
 if(role==='admin'){
  USERS.push({email,password,role})
  res.status(200).json({status:"ADDED_NEW_ADMIN"});
  return;
}

  USERS.push({email,password});
  res.status(200).json({status:"ADDED_NEW_USER"});
})

app.post('/login',async (req, res)=> {
  const {email,password} = req.body;

  if(!email || !password){
    res.status(400).json({status:"INVALID_REQUEST"});
  }

  const IndexOfUser =  getEmailIndex(email); 

  if(IndexOfUser<0){
    res.status(400).json({status:"NO_USER"})
  return;
  }
  
  if(!(await bcrypt.compare(password, USERS[IndexOfUser].password))){
    res.status(400).json({status:"WRONG_PASSWORD"});
    return;
  }

  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({ status: 'SUCCESS', accessToken: accessToken });

});

app.get('/questions',  (req, res) => {
  res.status(200).json({QUESTIONS})
})

app.get("/submissions/:title", (req, res) => {
  const { title } = req.params;
  const matchingSubmissions = SUBMISSION.filter(submission => submission.title === title);
  res.status(200).json({matchingSubmissions})
});


app.post("/submissions",authenticateToken ,(req, res) => {
  const randomBoolean = Math.random() >= 0.5;
  if(randomBoolean){
    const { title, body } = req.body;
    const email = req.email.email;
    SUBMISSION.push({title,body,email})
    res.status(200).json({status:"ADDED_NEW_SUBMISSION"})
    return;
  }
  res.status(400).json({status:"SUBMISSION_REJECTED"});
});


app.post("/questions",authenticateToken,(req,res)=>{
  const email = req.email.email;
  if(!isAdmin(email)){
    res.status(400).json({status:"NOT_ADMIN"});
    return;
  }
  const {question} = req.body;
  if(isQuestionExisting(question.title)){
    res.status(400).json({status:"QUESTION_WITH_TITLE_EXISTS"});
    return;
  }
  QUESTIONS.push(question);
  res.status(200).json({status:"QUESTION_ADDED"})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})