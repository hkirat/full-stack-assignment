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

app.post('/signup', function (req, res) {


  const email = req.body.email;
  const password = req.body.password;
  const role=req.body.role;

  const emailExist = USERS.find((item) => item.email === email)
  if (emailExist) {
    res.status(401);
    res.json({ "message": "Email Already Exists" })
  } else {
    const userObj = {
      "email": email,
      "password": password,
      "role":role
    }
    USERS.push(userObj);
    res.status(200)
    res.json({ "message": "Account Registered Successfully!" })
  }

})

app.post('/login', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const currUser = USERS.find((item) => item.email === email)
  if (currUser) {
    const validPassword = (currUser.password === password);
    if (validPassword) {
      res.status(200);
      res.json({ "message": "Successfully logged in!" })
    } else {
      res.status(401);
      res.json({ "message": "Invalid Password!" })
    }
  } else {
    res.status(403)
    res.json({ "message": "Not Authorized!" })
  }
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200);
  res.json({"questions":QUESTIONS})
})

app.get("/submissions", function (req, res) {
  const submissionId=req.query.id;
  const allSubmission=SUBMISSION.every((item)=>item.id===submissionId);
  res.status(200);
  res.json({"data":allSubmission})
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const currSubmission=req.body.submission;
  const submission={
      "submission":currSubmission,
      "accepted":(Math.random()>=0.5)
  }
  SUBMISSION.push(submission)
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/create-problem",(req,res)=>{
  const user=req.body.user
  if(user.role==="admin"){
    const question=req.body.question
    QUESTIONS.push(question)
    res.status(200)
    res.json({"message":"successfully added the question"})
  }else{
    res.status(401)
    res.json({"message":"You must be admin to add a question!"})
  }

})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})