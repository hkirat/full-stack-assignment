const express = require('express')
const cors = require('cors');

const app = express()
app.use(express.json());
const port = 3001

const USERS = [];
const AdminSecretKey = "IAmAdmin"
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []

app.get('/', function(req,res){
  res.send("Hello charlie How are You !!!...")
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const obj = req.body;
  console.log(req.body)
  const found = USERS.length>0 && USERS.some(user => user.email == obj.email)
  console.log("Email = ", obj.email)
  console.log("Password = ", obj.password)
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(found){
    console.log("User Already Exists")
    res.status(409).send("User Already Exists No Need To Signup Again!!!")
  }
  else{
    console.log("user doesn't exist adding the user")
    USERS.push(obj);
    console.log(USERS);
    // return back 200 status code to the client
    res.status(200).send('SignUp Successfull')
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email , password} = req.body;
  const index = USERS.findIndex((value) => value.email === email && value.password === password)

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if(index === -1){
    res.status(401).send("User doesn't exist")
  }
  else{
    res.status(200).json({token: 'My-Name-Is-Aakash'});
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const problem = req.body;
  const randomNumber = Math.floor(Math.random() * 2);
  console.log(randomNumber)
   if(randomNumber){
    SUBMISSION.push(problem);
    // Store the submission in the SUBMISSION array above
    res.send("Submission Accepted")
   }
   else{
    res.send("Submission Rejected")
   }
  
});

app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
 res.json(SUBMISSION)
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/questions", function(req, res){
  const {secretKey, title, description, testCases} = req.body;
  if(!secretKey || !title || !description || !testCases){
    res.send("Required fields is missing in request body!!!")
  }
  if(secretKey === AdminSecretKey)
  {
    const obj = {
      title : title,
      description: description,
      testCases: testCases,
    }
    QUESTIONS.push(obj)
    res.status(200).send("Question Successfully added")
  }
  else{
    res.status(401).send("Authentication Failed")
  }
})
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})