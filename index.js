const express = require('express')
const app = express()
const port = 3001

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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
const { email, password} = req.body

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
const user_exist = USERS.find(user => user.email == email)
if(user_exist){
  return res.status(400).send('user exist')
}
else{
USERS.push({email, password})
return res.status(200).send('new user created')
}
  // return back 200 status code to the client
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
const {email,password} = req.body
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
const user = USERS.find(user=> user.email === email)
if(!user){
  return res.status(401).send('invalid user')
}
if(user.password !== password){
  return res.status(401).send('incorrect password')
}
else{
  const token = 'anyrandomstring'
  return res.status(200).json({token})
}
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {
res.status(200).json({QUESTIONS})
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
  res.status(200).json(SUBMISSION)
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
 
  const submit = MATH.random() * 100 < 50
  if(submit){
    res.status(200).send('accepted')
  }
  else{
    res.status(400).send('rejected')
  }
   // let the user submit a problem, randomly accept or reject the solution
   const submission = {
    user: req.body,
    submit,
    time: new Date()
   }
   SUBMISSION.push(submission)
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

app.post('/problems',(req,res)=>{
  const problem ={
    title: req.body,
    description: req.body,
    time: new Date()
  }
  if(req.user !== req.user.admin){
    return res.status(401).send('sorry you are just a user')
  }
  QUESTIONS.push(problem)
  return res.status(200).send('you are just able to do this beacuse you are an admin')
})
// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port,()=> {
  console.log(`Example app listening on port ${port}`)
})