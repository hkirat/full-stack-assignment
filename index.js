const e = require('express');
const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser'); // Middleware
app.use(bodyParser.urlencoded({ extended: false }));

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
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;
  
console.log(email+" "+password);
  if(!email||!password)
    res.status(400).send("Invalid input");
  if(!USERS.find(u=>u.email===email)){
    USERS.push({email,password});
    res.status(200).send("New User created");
  }
  else
    res.status(200).send("User already exists");
})

app.post('/login', function(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  if(!email||!password)
    res.status(400).send("Invalid input");
  let loggedinuser=USERS.find(u=>u.email===email);
  if(!loggedinuser
  || loggedinuser && loggedinuser.password!=password)
  res.status(401).send('You are unauthorized'); 
  else
  res.status(200).send('You are loggedin.'); 
})

app.get('/users', function(req, res) {
  res.status(200).send(USERS);
})

app.get('/questions', function(req, res) {
  res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   res.status(200).send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   let email = req.body.email;
   let code = req.body.code;
   let question = req.body.question;
   let substatus=Math.random() < 0.5;
    SUBMISSION.push({
      question,email,code,substatus
    })
  res.status(200).send("Submitted successfully")
});


app.post("/questions/add", function(req, res) {
  let email = req.body.email;
  let description = req.body.description;
  let title = req.body.title;
  let testCases = req.body.testCases;
  if(!email || !title)
    res.status(400).send("Invalid input");
  if(email!="admin@email.com")
    res.status(401).send("You are unauthorised to add question");
  else{
    QUESTIONS.push({
      title,description,testCases
    });
    res.status(200).send("Question added successfully")
  }
 
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})