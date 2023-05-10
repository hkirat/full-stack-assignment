const express = require('express')
const app = express()
const port = 3001

const USERS = [];
const SUBMISSION = [];
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];
 const ADMINS = [{
  username : "admin",
  password: "admin"
 }];

 //middleware to check if user is admin
function isAdmin(req,res,next){
   const authHeader = req.auth.header.authrization;
   
   if(!authHeader || !authHeader.startsWith("Baearer ")){
    return res.status(401).send("unauthorized");
   }
   const token = authHeader.substring(7);
   if(!ADMINS.some(admin => admin.token === token)){
    return res.status(403).send("forbiden");
   }

  next()
}

app.use(express.json());

app.post('/signup', (req, res)=> {
  // Add logic to decode body
  // body should have email and password
 const {email,password} = req.body
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
if(!email || !password){
  res.status(400).send("Email and Password are required")
  return;
}
if(USERS.find(user=> user.email === email)){
  res.status(409).send("user is already exists")
  return;
}
  // return back 200 status code to the client
  USERS.push({email, password})
  res.status(200).send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
 const{email,password} = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if(!email || !password){
    res.status(400).send("email and password is required");
    return;
  }
  const user = USERS.find(user => user.email === email);

  if(!user){
    res.status(401).send("user not find")
    return;
  }
// If the password is not the same, return back 401 status code to the client
  if(user.password !== password){
    res.status(401).send("invalid credentials")
    return;
  }
  // If the password is the same, return back 200 status code to the client

  // Also send back a token (any random string will do for now)
  const token = "sdffvcxvxvsd";
  res.status(200).json({token});
})

app.get('/questions', (req, res)=> {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", (req, res)=> {
   // return the users submissions for this problem
  res.json(SUBMISSION);
});


app.post("/submissions", (req, res)=> {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  if(!problemId || !code){
   res.status(400).send("problem id and code are required");
   return;
  }
   const submission = {
    id: SUBMISSION.length + 1,
    problemId,code,
    accepted : Math.random() >=0.5
   }

   SUBMISSION.push(submission);
   res.status(200).send("Submit Successfully");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that. 


app.post("/question",isAdmin,(req,res)=>{
  const {title,description,testCases}= req.body;
  
   if(!title || !description || !testCases){
    res.status(400).send("title , description and test case")
    return;
   }

   const newQuestion = {
    id: QUESTIONS.length + 1,
    title,
    description,
    testCases
   }
   QUESTIONS.push(newQuestion);
   res.status(200).send("Added a new   Question")
})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})