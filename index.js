const express = require('express')
const app = express()
const port = 3001
const bodyparser = require('body-parser')


app.use(bodyparser.json())
const USERS = [
  {
    email: "uubuhbbdc",
    password: "12345",
    isAdmin: false
}
];

const QUESTIONS = [
  {
    id: '1',
    title: "One states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    id: '2',
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    id: '3',
    title: "Three states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    id: '4',
    title: "Four states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  }
];


const SUBMISSION = [
  {
    questionid: '2',
    question: 'Two states',
    acceptence: true
  },
  {
    questionid: '2',
    question: 'Two states',
    acceptence: false
  }

]

app.post('/signup', function(req, res) {
  const {email, password, admin} = req.body

  if(!email || !password ){
    res.status(400).send('Password or email not provided!');
    return
  }

  // Add logic to decode body
  // body should have email and password
  const isAdmin = admin;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const alreadySignup = USERS.find(user => user.email === email)
  if(!alreadySignup){
    USERS.push({email, password, isAdmin})
    return
  }
  // return back 200 status code to the client
  res.status(200).send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password} = req.body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find( user1 => user1.email === email)

  // Also ensure that the password is the same
  if(!user){
    res.status(404).send("User not found!")
    return

  }
  if(user.password != password){
    res.status(401).send("Invalid credentials")
    return
  }
  const token = Math.random().toString(16).substring(9)

  


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.status(200).json({message:'Login succesfull', token:token})
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json({QUESTIONS})
})

app.get("/submissions/:Qid", function(req, res) {
  const id = req.params.Qid

  const submissions = SUBMISSION.filter(submission => submission.questionid === id)
  if(submissions.length == 0){
    res.status(404).send("No submissions found")
    return
  }
   // return the users submissions for this problem
  // res.send("Hello World from route 4!")
  res.status(200).send(submissions)
});


app.post("/submissions/:Qid", function(req, res) {
  const{question, solution} = req.body

   // let the user submit a problem, randomly accept or reject the solution
   const passed = Boolean(Math.random > 0.5)
   // Store the submission in the SUBMISSION array above
   SUBMISSION.push({questionid: req.params.Qid, question: question, acceptence: passed})
  res.send("Hello World from route 4!")
});


const authAdmin =(req, res, next) =>{
  const{email, password} = req.body
  if( !email || !password ){
    res.status(400).send("Email or password not provided")
    return
  }
  const findUser = USERS.find(user => user.email === email && user.password === password)

  if(!findUser){
    res.status(401).sned("Invalid credentials")
    return
  }
  if(!findUser.isAdmin){
    res.status(401).send("User is not an admin")
    return
  }
  next()
}
app.post('/questions', authAdmin, (req, res)=>{
  const {id, title , description, testcases} = req.body
  if(!id || !title || !description || !testcases){
    res.status(401).send("Prove all the details")
    return
  }
  QUESTIONS.push({id:id, title:title, description:description, testCases:testcases})
  res.send(200).send("Questions posted succesfully")


})
// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})