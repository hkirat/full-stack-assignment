const express = require('express')
const app = express()

require('dotenv').config()

const port = process.env.PORT;


app.use(express.json())

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


function adminRole(req, res, next) {
  const userRole = USERS.find(u => u.role === "admin")

  if(!userRole) {
    res.status(200).send("You are not allowed to access this feature");
  }else{
    next();
  }
}

app.post('/signup', function(req, res) {
  
  const {email, password, role} = req.body;

  const user = USERS.find(u => u.email === email);

  if(user){
    return res.status(409).send("User already exists");
  }else{
    USERS.push({ email, password, role });
  }

  res.status(200).send("User registered successfully");
})

app.post('/login', function(req, res) {

  const { email, password } = req.body;

  const user = USERS.find(u => u.email === email);
  
  if(!user){
    return res.status(401).send('User not found');
  }else{
    if (user.password !== password) {
      return res.status(401).send('Incorrect password');
    }else{
      res.json({ token: process.env.SECRET_KEY });
    }
  }

})

app.get('/questions', function(req, res) {
  res.send(
    QUESTIONS.map((question, index) => ({ problemId: index, ...question }))
  );
})

app.get("/submissions", function(req, res) {
  const { email } = req.body;
  if (!email) {
    res.status(200).send([]);
  }
  const userSubmission = SUBMISSION.filter(
    (submission) => submission.email === email
  );

  res.status(200).send(userSubmission);
});


app.post("/submissions", function(req, res) {

  const { email, problemId, solution } = req.body;

  const isAccepted = Math.random() < 0.5;

  SUBMISSION.push({ email, problemId, solution, isAccepted });

  res.status(200).send({isAccepted});

});


app.post('/questions', adminRole, function(req, res) {
  const { title, description, testCases } = req.body;
  const question = { title, description, testCases };
  QUESTIONS.push(question);
  res.status(200).send("Question added successfully");
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})