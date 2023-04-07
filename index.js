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
  const {email, password}=req.body;
  if(!email || !password)
      return res.status(400).send('enter email and password');
   USERS.forEach((user) => {
        if(user.email===email){
            return res.status(201).send('email already exist');
        }
   }
  
  
        
  // body should have email and password
//    res.send('Hello World!')

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    USERS.push({email,password});
    return res.status(200).send('new user created');

  // return back 200 status code to the client
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    const {email, password}=req.body;
    if(!email || !password)
      return res.status(400).send('enter email and password');
    const user = USER.find(user => {
        user.email === email;
    })
    if(!user)
        return res.status(400).send('user not found');
    
    if(user.password!==password)
        return res.status(401).send('password incorrect');
    else{
        let token="fasdfafgvc";
        return res.status(200).json({'login successful' , token});}
    

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
    

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


//   res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
//   res.send("Hello World from route 3!")
    res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
//   res.send("Hello World from route 4!")
    
    SUBMISSION.forEach((sub)=>{
        if(sub.title===title)})
    
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
//   res.send("Hello World from route 4!")

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
