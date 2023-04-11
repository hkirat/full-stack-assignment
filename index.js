const express = require('express')
const app = express()


app.use(express.json())
const port = 3000

const USERS = [];

const QUESTIONS = [{
    questionId:1,
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

  const {email, password,isAdmin} = req.body;  
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const user = USERS.find(user => user.email === email);

  if(user){
    res.status(401).json({error: "User already exists"})
  }else{
    const newUser = {
      email,
      password,
      isAdmin
    }
    USERS.push(newUser);
    res.status(200).json({message: "User singin successful"})
  }

  // return back 200 status code to the client
  // res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email);
  if(user){
    if(user.password === password){
      res.status(200).json({message: "User login successful"})
    }else{
      res.status(401).json({message: "Password is incorrect"});
    }
  }else{
    res.status(401).json({error: "User does not exist"});
  }


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  // res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array

  res.status(200).json(QUESTIONS);

  // res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const {questionId,email} = req.query;
   const submissions = SUBMISSION.filter(submission => submission.questionId == questionId && submission.email == email);
   if(submissions){
    res.status(200).json(submissions);
   }else{
    res.status(404).json({error: "No submissions found"})
   }
  // res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
    const {questionId,email,code} = req.body;
    const submission =  {
      questionId,email,code
    }
    SUBMISSION.push(submission);
    
    // randomly acceptor reject the submission
    const random = Math.random();   
    if(random > 0.5){
      res.status(200).json({message: "Submission successful"})
    } else{
      res.status(400).json({message: "Submission failed"})
    }

    
  // res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const checkAdmin = (req,res,next) => {
  const {email} = req.body;
  const user = USERS.find(usr => usr.email === email);
  if(user){
    if(user.isAdmin == 1){
      return next();
    }else{
      res.status(401).json({error:"Not authorized"});
    }
  }else{
    res.status(404).json({error:"not admin found"})
  }
  
}

app.post('/addquestion',checkAdmin,(req,res)=>{
  const {title,description,testCases} = req.body;
  const question = {
    questionId:QUESTIONS.length+1,
    title,
    description,
    testCases
  }
  QUESTIONS.push(question);
  res.status(200).json({message: "Question added successfully"});
})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})