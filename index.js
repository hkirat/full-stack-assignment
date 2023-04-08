const express = require('express')
const bcrypt = require('bcrypt');
const app = express()
const port = 3000

const USERS = [];
const adminInfo=[];
let admin = false;

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  const {email,password} = req.body;
  const existingUser = USERS.find(user => user.email == email);
  if(existingUser){
    res.send("User Exist");
  }
  else{
    const saltRounds = 10; 
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    USERS.push({email , "password" : hashedPassword});
    res.status(200).send("Registration successful")
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
 
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email == email);
  admin = adminInfo.find(admin => admin.email == email && bcrypt.compareSync(password, user.password));

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }
  // Compare the entered password with the hashed password stored in USERS array using bcrypt
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).send('Invalid email or password'); 
  }
  res.status(200).send("Login Successfully")
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

  const {id,code,isAcceptable} = req.body;
  isAcceptable= Math.floor(Math.random()*2);
  SUBMISSION.push({id,code,isAcceptable});
  res.status(200).send(`${isAcceptable}? "Solution Accepted":"Solution rejected"`)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/questions',function(req,res){
  const {title,description,testCases}= req.body;

  if(admin){
    QUESTIONS.push({
      "title":title,
      "description" : description,
      "testCases" : testCases
    })
   return  res.status(200).send("Question Added Successfully")
  }
  res.status(401).send("Sorry,Only Admins can post Questions")
})



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})