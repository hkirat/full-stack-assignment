const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001
app.use(bodyParser.json());

const USERS = [];

const QUESTIONS = [{
    id:1,
    title: "Find Max",
    description: "Given an array , return the maximum of the array.",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},

{
  id:2,
  title: "Find Mean",
  description: "Given an array , return the mean for all elements.",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "3"
  }]
}];

const TOKENS = new Map();
const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // curl -H "Content-Type: application/json" -X POST -d "{\"email\":\"rb@123.com\",\"password\":\"abc\",\"isAdmin\":true}" http://localhost:3001/signup
  
  // Add logic to decode body
  // body should have email and password
  const {email,password,isAdmin=false} = req.body
  const user = USERS.find(user => user.email === email);

  // //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(user){
    return res.status(400).json({ message: "User already exists" });
  }
  
  USERS.push({email,password,isAdmin});
  // return back 200 status code to the client
  res.status(200).json({message:"Signup Successful"});
})

app.post('/login', function(req, res) {
  //curl -H "Content-Type: application/json" -X POST -d "{\"email\":\"rb@123.com\",\"password\":\"abc\"}" http://localhost:3001/login
  
  
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email===email && user.password === password)


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if(user){
    const token = Math.random().toString(36).substring(7);
    // const token = "abc123";
    TOKENS.set(token,email);
    return res.status(200).json({token,isAdmin:user.isAdmin});
  }
  // If the password is not the same, return back 401 status code to the client
  else{
    return res.status(401).json({ message: "User or Password doesn't exist" });
  }
})

app.get('/questions', function(req, res) {
  //curl http://localhost:3001/questions


  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})
// adding a new question only for admin
app.post('/questions',function(req,res){
  //curl -X POST -H "Content-Type: application/json" -d "{\"token\":\"abc123\",\"title\":\"new problem\",\"description\":\"test\",\"testCases\":[]}" http://localhost:3001/questions

const {token,title,description,testCases} = req.body
const email = TOKENS.get(token);
if(!email){
  return res.status(401).send("Invalid Token");
}
const admin = USERS.find(u=> u.email===email && u.isAdmin===true)
if(!admin){
  return res.status(401).send("User is not an admin");
}
const problemId = QUESTIONS.length + 1;

QUESTIONS.push({id:problemId,title,description,testCases});
// return back 200 status code to the client
res.status(200).json({message:"Question is added"});
})

app.get("/submissions", function(req, res) {
//curl "http://localhost:3001/submissions?problemId=1&token=abc123" 

  // return the users submissions for this problem
 const {problemId,token} = req.query;
 const pId = parseInt(problemId);
 const email = TOKENS.get(token);
 if(!email){
   return res.status(401).send("Invalid token");
 }
 const submission = SUBMISSION.filter(sub => sub.problemId === pId && sub.email===email);
 if(submission){
   return res.status(200).json(submission);
 }
 else {
   return res.status(400).send("No Submissions for given problem found");
 }
});



app.post("/submissions", function(req, res) {
  //curl -X POST -H "Content-Type: application/json" -d "{\"problemId\":1,\"token\":\"abc123\",\"solution\":\"console.log(\\\"Hello World\\\");\"}" http://localhost:3001/submissions


  const {problemId,token,solution} = req.body;
  const email = TOKENS.get(token);
  //token check
  if(!email){
    return res.status(401).send("Invalid Token");
  }
  //question ID check
  const question = QUESTIONS.find(q => q.id === problemId)
  if(!question){
    return res.status(400).send("Question Not Found");
  }

  // random acceptance
  const isAccepted = Math.random() < 0.5;
  if(isAccepted){
    const solutionId = SUBMISSION.filter(sub => sub.problemId===problemId && sub.email === email).length + 1;
    SUBMISSION.push({solutionId,problemId,email,solution});
    return res.status(200).send("Solution Accepted");
  }
  else{
    return res.status(200).send("Solution Rejected");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
