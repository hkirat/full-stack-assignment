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


const SUBMISSIONS = [

]

app.post('/signup', function(req, res) {
  const { email, password } = req.body; // Get email and password from request body

  // Check if user with email already exists in USERS array
  const userExists = USERS.some(user => user.email === email); //RETURNS true if the given function holds true for any element of the array
  if (userExists) {
    return res.status(409).send("User with this email already exists");
  }
  USERS.push({ email, password });
  res.status(201).send('User Created Successfully'); //response code 201 because new user is added(NEW RESOURCE CREATED)
})

app.post('/login', function(req, res) {
  const { email, password } = req.body;
  const required_user = USERS.filter(user => user.email === email)
  if(required_user.length !== 0){
    const same_pwd = required_user.some(user => user.password === password)
    if(same_pwd){
      res.status(200).json({token : Array.from({ length: Math.floor(Math.random()*100) }, (_,index) => String.fromCharCode(Math.floor(Math.random()*100))).join('')})
    }
    else{
      res.status(401).send("Wrong Password,Retry again.")
    }
  }
  else{
    res.status(404).send("User doesn't have an account associated with the given email.")
  }
})

app.get('/questions', function(req, res) {
  for(let i=0;i<QUESTIONS.length;i++){
    res.status(200).send(`Question ${i+1} : ${QUESTIONS[i]}`)
  }
})

app.get("/submissions", function(req, res) {
  res.status(200).send(SUBMISSIONS)
});


app.post("/submissions", function(req, res) {
  const { solution } = req.body
  if(Math.random() < 0.6){ //PSEUDO RANDOMLY ADDING SOLUTIONS
    SUBMISSIONS.push({ solution })
  }
  res.status(200).send(SUBMISSIONS)
});

app.post('/problems', function(req, res, isAdmin) {
  if (!isAdmin) {
      return res.status(401).send('Unauthorized');
  }
  const { title, description, testCases } = req.body;
  QUESTIONS.push({ title, description, testCases });
  res.sendStatus(200);
  });

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})