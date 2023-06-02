const express = require('express')
const app = express()
const port = 3001
app.use(express.json());

const USERS = [];
const QUESTIONS = [{
    problemId:"a;ldkfjalk123487",
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]
// middleware function for checking the user is admin or not
function adminOrNot(res,req,next){
  if(req.user && req.user.role == 'admin'){
    next()
  } else{
    res.status(403).send('Access Denied')
  }
}

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const{email,password} = req.body;

  // body should have email and password
  const existingUser = USERS.find((user)=> user.email===email);
  if(existingUser){
    res.status(409).json({message:"User already Exists"});
  };
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email,password});

  // return back 200 status code to the client
  res.status(200).json({message:"Signup succesfull "});
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const{email,password} = req.body;
  // body should have email and password
  
  // Check if the user with the given email exists in the USERS array
  const emailExistOrNot = USERS.find((user)=>user.email===email);
  const passwordExistOrNot =USERS.find((user)=>user.password===password);
  // Also ensure that the password is the same
  if(emailExistOrNot && passwordExistOrNot){
    // If the password is the same, return back 200 status code to the client
    const token = "falsdkalvnalkval#4@%66"  ;
    res.status(200).json({message:"login Successful",
                            token});
  }
  else {
     res.status(401).json({message:"Unauthorized"});
  }
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   //return the user submissions for this problem
   const{problemId}= req.body;
   const submission = SUBMISSION.problemId;

  res.status(200).send("solution sent Successfully")
});


app.post("/submissions", function(req, res) {

  const{userid,problemid,solution} = req.body  // destructuring 
   // let the user submit a problem, randomly accept or reject the solution
   const isAccepted = Math.random() < 0.5
   const submission = {
    userid:userid,
    promblemId : problemid,
    solution : solution,
    isAccepted : isAccepted,
   }
   // Store the submission in the SUBMISSION array above
   SUBMISSION.push(submission)
  if (isAccepted) {
    res.send("Your Code is correct and accepted")  
  }
  else {
    res.send("Your Code is incorrect,Try Again")
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/makeQuestions",adminOrNot,(res,req) =>{
   const{problemId,description,title,testCases} = req.body;

})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})