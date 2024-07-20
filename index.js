const express = require('express')
const app = express()
const port = 3001

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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const{email, password,admin} = req.body;
  //the admin here is a bool value which can be used further whenever questions have to be created

  //Store email and password (as it is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists=USERS.some(user=>user,email===email);

  //if user exists then-
  if(userExists){
    return res.status(400).send("user already exists");
  }

  //if user does not exist then-
  //storing the new user's email and password in the USERS array above
  USERS.push({email,password,admin});
  // return back 200 status code to the client
  res.status(200).send("signed up successfully")
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;

  // Check if the user with the given email exists in the USERS array
  const userExists = USERS.some(user=>user.email===email);
  if(userExists){
    return res.status(200).send("user exists and can be logged in");
  }

  // Also ensure that the password is the same
  const isSamePassword =USERS.some(user=>user.password===password);


  // If the password is the same, return back 200 status code to the client
  // Also sent back a token - "abc" 
  if(isSamePassword){
    const token="abc";
    return res.status(200).send(token);
  }

  
  // If the password is not the same, return back 401 status code to the client
  if(!isSamePassword){
    return res.status(401).send("invalid password");
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);

})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  
});

function getRandomAcceptance() {
  return Math.random() >= 0.5; // 50% chance of acceptance
}

app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const{problemId,user,code}=req.body;

   // Store the submission in the SUBMISSION array above
  const newSubmission={
    id:SUBMISSIONS.length+1,//generated new id
    problemId,
    user,
    code,
    isAccepted:getRandomAcceptance()

  }
});


app.post("/addProblem",function(req,res){
 const{admin}=req.body;

 if(!admin){
  return res.status(403).send("only admins can add problems");
 }

 res.status(200).send("you are an admin");
})

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})