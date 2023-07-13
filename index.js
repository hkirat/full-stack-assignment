const express = require('express')
const app = express()
const port = 3001
app.use(express.json());
const USERS = [{
    email: "xyz@gmail.com",
    password: "xyz@123*",
    admin: true
}];

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

const searchuser=(email)=>{
  const user=USERS.find((user)=>user.email===email);
  if (user) return user;
  return undefined;
}
app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const body = req.body;
  if (!body.email || !body.password) {
    res.status(400).send("Email and password are required");
    return;
  }
  const user = {
    email: body.email,
    password: body.password,
    admin: false //given false by default
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  if (searchuser(user.email)) {
    res.status(400).send("User already exists");
    return;
  }
  if (user.password.length<8){
    res.status(400).send("Password should be atleast 8 characters long");
    return;
  }
  USERS.push(user);
  // return back 200 status code to the client
  res.status(200).send('user added successfully')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const body = req.body;
  if (!body.email || !body.password) {
    res.status(400).send("Email and password are required");
    return;
  }
  const user = searchuser(body.email);

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (user===undefined){
    res.status(404).send("User does not exist");
    return;
  }
  if (user){
    if (user.password===body.password){
      res.status(200).send('User logged in successfully')
      return;
    }
    else{
      res.status(401).send("Incorrect Password");
      return;
    }
  }
    

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  // res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
  //return the user all the questions in the QUESTIONS array
  // res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
  res.json(SUBMISSION).status(200);
   // return the users submissions for this problem
  // res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
  const submission = req.body;
  const accepted = Math.random() > 0.5;
  submission.accepted = accepted;
  SUBMISSION.push(submission);
  if (accepted) {
    res.send("Solution Accepted").status(200);
  } 
  else {  
    res.send("Solution Rejected").status(200);
  }
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  // res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/addquestion', function(req, res) {
  const body=req.body;
  const user=searchuser(body.email);

  if (user===undefined){
    res.status(404).send("User does not exist");
    return;
  }
  if (user){
    if (user.password!==body.password){
      res.status(401).send("Incorrect Password");
      return;
    }
    else if (user.admin===false){
      res.status(401).send("User is not an admin");
      return;
    }
  }
  if (!body.title || !body.description || !body.testCases) {
    res.status(400).send("requirements not fulfilled for making a question");
    return;
  }
  const question = {
    title: body.title,
    description: body.description,
    testCases: body.testCases
  }
  QUESTIONS.push(question);
  res.status(200).send('Question added successfully')
})
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})