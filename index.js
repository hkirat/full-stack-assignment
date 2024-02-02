const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
app.use(bodyParser.json());
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
app.get('',(req,res)=>{
 res.send("Hello There ")
})
app.post('/signup', function(req, res) {
  

const {email,password} = req.body
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
const emailpresent = USERS.some((check)=> check.email=== email);
if(!emailpresent){
  USERS.push({email,password});
}
else{
  console.log('email already present bro ')
}
  

  // return back 200 status code to the client
  console.log(USERS)
  res.send('Hello World!')
})
// app.get('/signup', function(req, res) {
//     // Handle the GET request for /signup
//     res.send(USERS);
// });

// app.post('/signup', function(req, res) {
//     // Handle the POST request for /signup
//     USERS.push(req.body);
//     console.log(USERS);
//     res.send('Hello World!');
// });



app.post('/login', function(req, res) {

const {email,password}= req.body;
if(email !="" && password != ""){
  if(USERS.some(obj=>obj.email===email && obj.password===password)){
 console.log("aana aajaha")
 res.status(200).json({ success: true, message: "Login successful" });

  }
  else{
    console.log('Invalid email or password');
    return res.status(401).json({ success: false, message: "Invalid email or password" });

  }
}
else {
  console.log("Email or password is not provided ");
  return res.status(401).json({ success: false, message: "Email and password are required" });

}


})

app.get('/questions', function(req, res) {
   res.json(QUESTIONS);
  })

app.get("/submissions", function(req, res) {
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {

   const inAccepted = Math.random()<0.5;
   SUBMISSIONS.push({
    data: submissionData,
    accepted: isAccepted,
    timestamp: new Date()
  });

  if (isAccepted) { 
    res.status(200).json({ message: 'Submission accepted successfully' });
  } else {
    res.status(403).json({ message: 'Submission rejected' });
  }
  
  });

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.\
const problem =[];
const ADMIN_USER = {
  email: "email123",
  password: "adminpass",
};
const isAdmin = (req,res,next)=>{
 if(req.body.email == ADMIN_USER.email && req.body.password== ADMIN_USER.password){
  next();
 }
 else{
  res.status(403).json({ message: 'Permission denied. Only admins can perform this action.' });
 }
}

app.use(express.json());
app.post("/add",isAdmin,function (req,res){
//  console.log(req.body);
   SUBMISSION.push(req.body);
   console.log(SUBMISSION)
   res.status(200).json({ message: 'Submission accepted successfully' });
// need to understand this thing
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})