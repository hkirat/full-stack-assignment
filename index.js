const express = require('express')
const app = express()
const port = 3001

const USERS = [];
const AdminToken = "lucky";
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
     const {email,password} = req.body();
     if(!email || !password)
     return res.status(400).send("fill the required field");
     const userExists = USERS.some((user) => user.email === email);
      if(!userExists)
     {
      USERS.push({email,password});
        return res.status(200).send("signup successfully");
     }
      else
       return res.status(400).send("user already exists");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
     const {email, password} = req.body();
     if(!email || !password)
     return res.status(400).send("fill the required field");
  // Check if the user with the given email exists in the USERS array
     const userExists = USERS.find((user) => user.email === email);
     if(!userExists)
     {
     
        return res.status(400).send("user doesn't exists");
     }

 // Also ensure that the password is the same
      else{
        // If the password is the same, return back 200 status code to the client
          // Also send back a token (any random string will do for now)
        if(userExists.password === password){
          const token = "here is your token";
          return res.status(200).send({ token });
        }
         // If the password is not the same, return back 401 status code to the client 
        else
        return res.status(401).send("wrong password");
      }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const {problemId, sol} = req.body();
   const selection = Math.random()*10;
   const ans1 = true;
   const ans2 = false;
   if(selection<5)
   SUBMISSION.push({problemId,sol, ans1});
   else
   SUBMISSION.push({problemId,sol, ans2});

   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.post("/admin_page", function(req,res){
      const{token} = req.body();
      if(token === AdminToken){
        const {title, description, testCases} =req.body();
        QUESTIONS.push({title, description,testCases});
        res.status(200).send("problem added successfully");
      }
      else
      res.status(401).send('Invalid Admin Id');
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})