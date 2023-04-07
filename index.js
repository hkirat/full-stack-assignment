const express = require('express')
const app = express()
const port = 3001

const USERS = [];
const ADMINS = [];
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  const data = req.body;
  const object = {'email':`${data.email}`,'pwd':`${data.password}`}
  const found = USERS.find((obj)=>obj.email == data.email)
  if (!found){
    USERS.push(object)
    res.send('Email registered')
    res.status(200).send('Success')
  }
  else{
    res.send('Email already in use')
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const data = req.body;
  const found = USERS.find((obj)=> obj.email == data.email && obj.password == data.password )
  if(found){
    res.status(200).header('Authorization','w919nfd92n13ngf1ng3adncvowv').send('Success')
  }
  else{
    res.status(401).send('Invalid Username/Password')
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const token = req.headers.Authorization
  res.json(SUBMISSION.filter((submission)=> submission.token == token))
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const token = req.headers['Authorization']
  const status = Math.floor(Math.random()*2)
  const submission = {'token':token,'answer':req.body,'status':status}
  SUBMISSION.push(submission)
});

app.post("/admin",function(req,res){
  // leaving as hard todos
  // Create a route that lets an admin add a new problem
  // ensure that only admins can do that.
  //Assume data contains email, password,question related things
  const data = req.body
  const found = ADMINS.find((obj)=> obj.email == data.email && obj.password == data.password )
 if(found){
  const object = {
    title: data.title,
    description: data.description,
    testCases: data.testCases
  }
  QUESTIONS.push(object)
  res.status(200).send('Success')
 }
 else{
  res.status(404).send('You are not admin')
 }
});
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})