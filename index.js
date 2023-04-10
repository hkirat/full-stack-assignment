const express = require('express')
const app = express()
const port = 3001

app.use(express.json());

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]},
    {
    title: "Find Duplicate Element",
    description: "Given an array, find first duplicate element",
    testCases: [{
        input: "[3,2,4,1,2,4,5]",
        output: "2"
    }]
}];


const SUBMISSIONS = [

]

let ACTIVE_USER = "";

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  USERS.forEach(element => {
    if(element.email === req.body.email){
      res.status(200).send("Successfully Registred");
    }
  });
  const user = {
    email: req.body.email,
    password: req.body.password
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push(user);
  
  // return back 200 status code to the client
  res.status(200).send("Successfully Registred");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  let flag = false;

  USERS.forEach(element => {
    if(element.email === req.body.email && element.password === req.body.password){
      flag = true;
    }

  });

  if(flag){
    const token = Math.random().toString().substring(2);
    res.status(200).json({ token });
    ACTIVE_USER = req.body.email;
  }
  else{
    res.status(401).send("User Information Not Found");
  }

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.status(200).send(SUBMISSIONS)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  
   // Check the user is loged in or not
   if(ACTIVE_USER === ""){
      res.send("Please Login ");
   }
   else if(req.body.user === ACTIVE_USER){
        

        const isCorrect = Math.random() < 0.5
        const submission = {
          title: req.body.title,
          description: req.body.description,
          solution: req.body.solution,
          result: isCorrect
      }

        SUBMISSIONS.push(submission);

        res.status(200).send("Submission successfully Submited");
    }
    else{
      res.send("user is not loged in");
    }


});

// Admin route to add a new problem
app.post('/admin/add-problem', function(req, res){
  // For simplicity, let's assume there's only one admin and their email is hardcoded
  const adminEmail = "admin@gmail.com";

  // Check if the user making the request is an admin
  if (req.headers.authorization !== adminEmail) {
    return res.status(401).send('You are not authorized to access this resource');
  }

  // Add the new problem to the QUESTIONS array
  const newProblem = req.body;
  QUESTIONS.push(newProblem);

  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})