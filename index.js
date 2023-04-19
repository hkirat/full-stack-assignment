const express = require('express')
const app = express()
const port = 3001

const USERS = [{
  email:'mail@gmail.com',
  password:'passowrd', 
  admin:true
}];


const QUESTIONS = [{
    number:201,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  {
    number:201,
    code:"",
    accepted:true
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;
  const admin = req.bodu.admin;

  //checking if user already exisits
  if(USERS.find(user=>user.email===email))
    return res.status(401).send({message:'User already exists'});


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({
    email,password,admin
  })

  // return back 200 status code to the client
  return res.sendStatus(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user=>user.email===email);
  if(!user)
    return res.status(401).send({message:"User doesn't exist"});
  else if(user.password!==password)
    return res.status(401).send({message:"Wrong Password"});
  
  


  // If the password is the same, return back 200 status code to the client
  return res.status(200).json({token:'randomStringToken'});
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


 
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  return res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  return res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
  const submission = req.body.submission;
  submission.accepted = Math.random()>0.5;
   // Store the submission in the SUBMISSION array above
  SUBMISSION.push(submission);

  return res.status(200).send({mssg: 'Submitted'});
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
// {
//   number:201,
//   title: "Two states",
//   description: "Given an array , return the maximum of the array?",
//   testCases: [{
//       input: "[1,2,3,4,5]",
//       output: "5"
//   }]
// }
app.post("/addQues",(req,res)=>{
  const email = req.body.email;

  //if current user is not an admin
  if(!USERS.find(user=>user.email===email).admin)
    return res.status(401).send({messg:'Users cannot add questions'});
  
  const number = QUESTIONS.length+1;
  const {title,description} = req.body;
  const testCases = req.body.testCases.map((testCase) => ({
    input: testCase.input,
    output: testCase.output
  }))

  QUESTIONS.push({
    number,title,description,testCases
  });

  return res.sendStatus(200);
  
})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})