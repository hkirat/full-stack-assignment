const express = require('express')
const app = express()
const port = 3001
//library for fake token string generation
const crypto = require('crypto');

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());
const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
  {
    title: "Sorting An Array",
    description: "Given an array , Sort the Array from max to min order",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}

];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  USERS.push(req.body);
  res.send("SignUp Done")
  console.log(USERS)
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  let userFound = false;
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === req.body.email && USERS[i].password === req.body.password) {
    let fakeToken = crypto.randomBytes(16).toString('hex');
      if(USERS[i].email === "admin@gmail.com"){
         fakeToken = "admin token"
      }
      res.status(200).send({ message: 'Logged in successfully!', token: fakeToken });
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    res.status(401).send({ message: 'Email does not exist or Password does not match' });
  }
});

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  const questionArray = QUESTIONS.map((question)=>{
    return question;
  });
  res.send(questionArray);

})

app.get("/submissions", function(req, res) {
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
  SUBMISSION.push(req.body)
  res.send("Submitted!")
});

app.post('/addQuestion', function(req, res) {
  // Check if user is authenticated as admin
  if (req.headers.authorization !== 'admin token') {
    res.status(401).send('Unauthorized');
    return;
  }

  // Add new question to QUESTIONS array
  QUESTIONS.push(req.body);
  res.status(201).send('Question added successfully');
})

app.listen(port, function() {
  console.log(`Example app listening on port http://localhost:3001`)
})