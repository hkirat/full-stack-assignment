const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express()
const port = 3001
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser());
const USERS = [];

const QUESTIONS = [{
    id:1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

const loginKey ='thisIsASampleToken';
var activeUser;

app.post('/signup', async function(req, res) {
  // Add logic to decode body
  const {role,name,email,password} = req.body;
  
  // body should have email and password
  if(!email||!password){
    return res.status(400).json({
      success:false,
      message:"Please enter email and password"
    })
  }

  const user=USERS.find((user)=> user.email == email);
  if(user){
    return res.status(400).json({
      success: false,
      message:"user already exist"
    })
  }

  USERS.push(req.body);
  
  res.status(200).cookie('token','thisIsASampleToken',{
    expires: new Date(Date.now()+24*60*60*1000),
    httpOnly:true
  }).json({
    success:true,
    message:"Sign up successful"
  })

  
  activeUser= USERS[USERS.length-1];
  
  
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;
 
  if(!email||!password){
    return res.status(400).json({
      success:false,
      message:"Please enter email and password"
    })
  }

  // Check if the user with the given email exists in the USERS array
  const user=USERS.find((user)=> user.email == email);
  console.log(user);
  if(!user){
    return res.status(400).json({
      success:false,
      message:"Please enter valid email and password "
    })
  }
  
  // Also ensure that the password is the same
  if(user.password === password){
    activeUser=user;
    res.status(200).cookie('token','thisIsASampleToken',{
      expires: new Date(Date.now()+24*60*60*1000),
      httpOnly:true
    }).json({
      success:true,
      message:"User logged in"
    })
  }
  else{
    res.status(401).json({
      success:false,
      message:"Please enter valid email and password "
    })
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  
})

app.get('/logout', function(req, res) {
  res.cookie('token',null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })
 

  res.status(200).json({
    success:true,
    message:"Logged Out"
  })
  
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  const {token} = req.cookies;
  if(token=== loginKey){
    res.status(200).json(QUESTIONS);
  }
  else{
    res.status(401).json({
      success:false,
      message:"Please log in to access this resource"
    })
  }
  
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const {token} = req.cookies;
   const email= activeUser.email;
   if(token!= loginKey){
    return res.status(401).json({
      success:false,
      message:"Please log in to access this resource"
    })
   }
   
   const {id} =req.body;
   const submission= SUBMISSION.find((submission)=> (submission.email == email)&& (submission.id== id));
   if(!submission){
    res.status(400).json({
      status:false,
      message:"no submissions available"
    })
   }
   res.status(200).json(submission.submission);

});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const {token} = req.cookies;
   const email=activeUser.email;
   if(token!= loginKey){
    return res.status(401).json({
      success:false,
      message:"Please log in to access this resource"
    })
   }
   req.body.email=email;
   const {submission,id,output} =req.body;
   const sub= SUBMISSION.find((submission)=> (submission.email == email)&& (submission.id==id));
   if(!submission||!id||!output){
    return res.status(400).json({
      success:false,
      message:"Code, Id and Output is necessary to submit"
    })
   }
   if(sub){
    return res.status(400).json({
      success:false,
      message:"Submission already exist"
    })
   }
   const question= QUESTIONS.find((question)=> question.id==id);
   if(!question){
    return res.status(400).json({
      success:"false",
      message:"give valid id"
    })
   }
   if(question.testCases[0].output!==output){
    return res.status(400).json({
      success:false,
      message:"Output is wrong, Code not accepted"
    })
   }

   SUBMISSION.push(req.body);
   res.status(200).json({
    success:true,
    message:"Code accepted and submitted"
   })
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addquestion", function(req, res) {
  if(activeUser.role!="admin"){
    return res.status(401).json({
      success:false,
      message:"Your role is not authorized to do this task"
    })
  }
  const {id,title,description,testCases}=req.body;
  if(!id||!title||!description||!testCases){
    res.status(400).json({
      success:false,
      message:"id, title, description or test cases are not provided"
    })
  }
  QUESTIONS.push(req.body);
  
  res.status(200).json({
    success:true,
    message:"New question added"
  })
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})