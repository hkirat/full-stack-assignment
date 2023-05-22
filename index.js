const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
app.use(bodyParser.urlencoded({extended : false}))

const USERS = [
  {
    email:"ashish@gmail.com",
    password: "ashish"
  }
];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  { 
  questionId : 1,
  questionDescription : "Given an array , return the element of the array?",
  questionTitle : "Two Sates",
  solution : "Solution it is"
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password=req.body.password;
  
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const userExists = USERS.some(user => user.email === email);
  if(!userExists){

    USERS.push({email : email,password: password});
    res.status(200).send("User is Created Successfully");
  }
  else{
    return res.status(400).send("User with this email already exists");
  }
  


  // return back 200 status code to the client
  

  
})


app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const Email=req.body.email;
  const Password=req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userMatched = USERS.some(user=>user.email===Email);
  
  const userPassMatched = USERS.some(user=>user.password===Password);
  
  if(!userMatched){
    return res.send(200).send("user not found,signup first")
  }
  if(userMatched&&userPassMatched){
    return res.status(200).send("u are logged in successfullly");
  }
  if(userMatched&& !userPassMatched){
    return res.status(401).send("password is incorrect");
  }
  

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  // res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const {questionId, questionTitle, questionDescription, solution} = req.body;
  SUBMISSION.push({questionId : questionId, questionTitle : questionTitle, questionDescription : questionDescription, solution : solution});
  
  if(Math.random()<1.5){
    res.send("Accepted")
  }
  else{
    res.send("Incorrect")
  }


});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.post("/questions",function(req,res){
  const { email, title, description, testCases } = req.body;
  const user = USERS.find((user) => user.email === email);
  if(!user || user.isAdmin !== true){
    res.status(401).send("Access Denied");
    return;
  }
  QUESTIONS.push({ title, description, testCases });
  res.status(200).send("Question created successfully");

})
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})