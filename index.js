const express = require('express')
const app = express()
const port = 3001

let USERS = [];

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

app.get('/',(req,res)=>{
  res.send('HI I am the home Page');
  console.log(req.headers);
})

app.post('/signup', function(req, res) {


  // Add logic to decode body
  // body should have email and password

  const email = req.body.email;
  const password = req.body.password;
  


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const index = USERS.findIndex((user)=>user.email == email);

  if(index == -1){
    USERS.push({email,password});
    res.status(200).send("User has been created Successfully");
  }



  // return back 200 status code to the client
  res.send('User Already Exists');
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const email = req.body.email;
  const password = req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  const index = USERS.findIndex((user)=>user.email == email);

  if(index==-1)
    res.status(401).send("User not available");

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if(USERS[index].password != password)
    res.status(401).send("Please Try Again with the Correct Password");

  res.status(200).send(
    {
      message : "Sign in successfull"
    });
 
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send({questions:QUESTIONS});
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})