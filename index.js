
const express = require('express');
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const KEY = "PriviteKey";//privite key for sign in token

const app = express();
const port = 3001;

app.use(express.json());

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSION = [];

const checkCode = (code) => {//function to check if user's code is correct or not 
  return Math.floor(Math.random());
}

const userEmail = (req,res,next)=>{//middleware to find email of user from token.
  const token = JSON.parse(req.headers.token);
  const email = jwt.verify(token,KEY);
  req.user = email;

  next();
}

app.post('/signup',[
  body("email").isEmail().notEmpty().custom(async (value)=>{//this line check if email alredy exist or not .
    USERS.forEach((user)=>{
      if(user.email === value){
        throw new Error('E-mail already in use');
      }
    })
  }),
  body("password").notEmpty()
],(req, res) =>{
  const result = validationResult(req);
  if (result.isEmpty()) {
    const tag = `${(req.body.tag)?req.body.tag:"general"}`
    USERS.push({...req.body,tag:tag});
    console.log(USERS);
    const token = jwt.sign(req.body.email,KEY);
    res.status(200).send(token);
  }
  else{
    res.send({error:'Some error occurred.'})
  }
})

app.post('/login',[
  body("email").isEmail().notEmpty(),
  body("password").notEmpty()
], (req, res) => {
  const result = validationResult(req);
  if(!(result.isEmpty())){
    res.status(401).send({error:'Some error occurred.'})
  }
  USERS.forEach((user)=>{//logic to find user's email in database.
    if(user.email === req.body.email){
      if(user.password === req.body.password){
        const token = jwt.sign(req.body.email,KEY);
        res.status(200).send(token);
      }
      else{
        res.status(401).send({error:'Incorrect Password.'})
      }
    }
    else{
      res.status(401).send({error:'Some error occurred.'})
    }
  })
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send({QUESTIONS});
})

app.post('/questions',userEmail,[//Allow the user to add more queations to QUESTIONS array if user is a admin.
  body("question").notEmpty()
], function(req, res) {
  const result = validationResult(req);
  if(!(result.isEmpty())){
    res.status(401).send({error:'Some error occurred.'})
  }
  
  const email = req.user;
  USERS.forEach((user)=>{
    if(user.email == email){
      if(user.tag === "admin"){
        QUESTIONS.push(req.body.question);
        console.log(QUESTIONS)
        res.send("one question added.");
      }
      else{
        res.status(403).send("Access denied")
      }
    }
  })
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.send({SUBMISSION});
});


app.post("/submissions",[//route to submit submissions .
  body("code").notEmpty()
], function(req, res) {
  const result = validationResult(req);
  if(!(result.isEmpty())){
    res.status(401).send({error:'Some error occurred.'})
  }
  else if(checkCode(req.body.code)){
    SUBMISSION.push({code:req.body.code,status:"accepted"});
    console.log(SUBMISSION);
    res.send("accepted")
  }
  else{
    SUBMISSION.push({code:req.body.code,status:"rejected"});
    console.log(SUBMISSION);
    res.send("rejected");
  }
});

app.listen(port, function() {
  console.log(`App listening on port ${port}`)
})