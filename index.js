const express = require('express')
const app = express()
const port = 3001

const USERS = [
  {

  }
];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum number of the array?",
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
  //userType is used to check whether a user is normal user or an admin who can add questions
const {email,password,userType} = req.body
  
  function checkEmail(user,email){
    return user.email===email
  }
  const userExists= USERS.some(user=>checkEmail(user,email))
   //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(!userExists){
    USERS.push({
      email:email,
      password:password,
      userType:userType
    })
    // return back 200 status code to the client
   return  res.status(200).send("signed up successfully")
   
  }
  else{
    return res.status(401).send("user with given email already exists")
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email:userEmail, password:userPassword}= req.body
  //Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  function checkUser(user,email,password){
    if(user.email==email){
      return true
    }
    else{
      return false
    }
  }
const userExists = USERS.some(user=>checkUser(user,userEmail,userPassword))
// If the password is the same, return back 200 status code to the client
if(userExists && user.password==password ){
  // Also send back a token (any random string will do for now)
  res.status(200).send("logged in successfully")
}
else{
   // If the password is not the same, return back 401 status code to the client
  res.status(401).send("invalid password")
}


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   //trying to get solution from the user , we can read question id so that each solution can be uniquely stored
   const {solution}= req.body
   //just a function that generates 1 or 0 randomly 
   function solutionValidater(){
    return Math.random()%2
   }
  
   if(solutionValidater()){
    // Store the submission in the SUBMISSION array above
    SUBMISSION.push({solution})
   }
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addNewProblem",function(req,res){
  if(userType=="admin"){
    const {newQuestion}=req.body
    QUESTIONS.push({newQuestion})
    res.send("you have added a new problem successfully")
  }
  else{
    res.status(401).send("you dont have permission to do this")

  }

});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})