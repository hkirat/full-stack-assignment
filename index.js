const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000

app.use(express.json())
const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    author: "Naman Arora",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSIONS = [

]

app.post('/signup', function(req, res) {
  // role is to define user role like admin
  const {email, password, role}=req.body;

  USERS.map((user)=>{
    if(user.email===email)
      res.status(409).send('User with this email id already exists!')
  })

  USERS.push({email:email, password:password, role:role})
  res.status(200).send("New User Created!")
})

app.post('/login', function(req, res) {
  const {email, password, role}=req.body;

  if(email&&password){
    USERS.map((user)=>{
      if(user.email===email && user.password===password){
        const token = jwt.sign({email:email, password:password, role:role}, 'success')
        res.status(200).send({token})
      }
    })
  }
  res.status(401).send('Invalid Details!')
})

app.get('/questions', function(req, res) {
  res.status(200).send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
  res.status(200).send(SUBMISSIONS)
});


app.post("/submissions", function(req, res) {
  const flag = Math.random()>0.5
  if(flag)
    res.send("accepted")
  else
    res.send("rejected")
});

app.post("/question",(req,res)=>{
  // here question is expected be an object that can directly be added
  const {role, question} = req.body
  if(role!="admin")
    res.status(403).send("You do not have access to this route.")
  QUESTIONS.push(question)
  res.send("Question Added!")  
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})