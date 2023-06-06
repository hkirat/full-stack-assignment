const express = require('express')
const app = express()
const port = 3001

app.use(express.json());

const USERS = [{
  "role" : "admin",
  "email" : "admin@test.com",
  "password" : "admin",
  "token":"iamadmin"
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
  {
    userId:'1',
    questionId :'1',
    code : 'console.log("This is hardcoded submission :) ")',
    status : 'accept'
  },
  {
    userId:'1',
    questionId :'2',
    code : 'console.log("This is hardcoded submission :) ")',
    status : 'reject'
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;
  if(req.body.email && req.body.password)
  {

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const exsistingUser = USERS.find(user => user.email === email);
  if(exsistingUser){
    return res.status(409).json({statusCode:409, message:'User with same email id already exsist!'});
  }

  USERS.push({email,password})

  // return back 200 status code to the client
  res.status(200).json({statusCode:200, message:'SignUp Successfull'})
}
else{
  res.status(400).json({statusCode:400, message:'Email and Password both are required'});
}
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  if(!req.body.email || !req.body.password){
    return res.status(400).json({statusCode:400, message:'Email and password are required'})
  }

  const{email,password} =req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  var checkUserEmail = USERS.find(user => user.email === email);
  if (!checkUserEmail){
    return res.status(404).json({statusCode:404,message:'User with the given emailid is not found'});
  }
 

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  var checkUserPassword = USERS.find(user=>user.password === password && user.email === email)
  if(checkUserPassword == false){
    return res.status(401).json({statusCode:401,message:'Password is incorrect'});
  }
  else{
    return res.status(200).json({statusCode:200,data:{"token":"radomtokenstringfornow","message":"Login Successfull"}})
  }
})

app.get("/submissions", function(req, res) {
  const token = req.headers.token;
   // return the users submissions for this problem
   if (token){
    res.status(200).json({statusCode:200,data:SUBMISSION});
   } else {
    res.status(401).json({statusCode:401,message:'You are not authorized! please login'})
   }
  
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
  const token = req.headers.token;
  if(token){
    const {userId, questionId, code} = req.body;
    const randomAcceptOrReject = throwDice();
    const status = randomAcceptOrReject ? 'accepted' : 'rejected';
    SUBMISSION.push({ userId, questionId, code, status });
  }
  else{
    res.status(401).json({statusCode:401,message:'Please Login'})
  }
   // Store the submission in the SUBMISSION array above
  res.status(200).json({statusCode:200, message:'Submission added successfully'});
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/questions', function(req, res) {
  const token = req.headers.token;
  if (token) {
    const user = USERS.find(user => user.token === token);
    if (user && user.role === 'admin') {
      const { title, description, testCases } = req.body;
      if (title && description && testCases) {
        const question = {
          title,
          description,
          testCases: Array.isArray(testCases) ? testCases : []
        };
        QUESTIONS.push(question);
        res.status(200).json({ statusCode: 200, message: 'Question added successfully' });
      } else {
        res.status(400).json({statusCode: 400, message :'Title, description, and testCases are required fields'});
      }
    } else {
      res.status(403).json({statusCode:403, message: 'Sorry, you are not authorized to add a question'});
    }
  } else {
    res.status(401).json({statusCode:401, message:'Please login'});
  }
});


app.get('/questions',function(req,res){
  const token = req.headers.token;
  if(token){
    const questionsList = QUESTIONS;
    if(questionsList.length > 0){
      res.status(200).json({statusCode:200, data:questionsList});
    }
    else{
      res.status(404).json({statusCode:404, message:'No Questions where found'});
    }
  }
  else{
    res.status(401).json({statusCode:401, message:'Please Login'});
  }
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

function throwDice() {
  const diceNumber = Math.floor(Math.random() * 6) + 1;
  if (diceNumber % 2 === 0) {
    return true;
  } else {
    return false;
  }
}
