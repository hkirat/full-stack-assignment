const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

const USERS = [];
const SUBMISSIONS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


app.get('/', function(req, res) {
  res.send(USERS)
});


app.post('/signup', function(req, res) {
  const { email, password }= req.body;

  const userExists = USERS.some((user) => user.email === email);

  if (!userExists){
    USERS.push({email, password});
    userIndex++;
    res.send('User created!')
    res.status(200);
  }
  else{
    res.send('User already exists!')
    res.send(401);
  }
})


app.post('/login', function(req, res) {
  const { email, password } = req.body;

  const user = USERS.find(user => user.email === email);

  if(user){
    if(user.password === password){
      res.status(200).send('User logged in!');
    }
    else{
      res.send("Password is incorrect!")
      res.status(401);
    }
  }
  else{
    res.send("User does not exist!")
    res.status(401);
  }
});


app.get('/questions', function(req, res) {
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  res.send(SUBMISSIONS);
});


app.post("/submissions", function(req, res) {
  const { question, code } = req.body;
  const submissionStatus = Math.random() > 0.5 ? "Accepted": "Rejected";
  SUBMISSIONS.push({question,code,submissionStatus});
  res.send("Submission Successful!");
});

app.post("/problems", function(req,res){

});

app.listen(port, function() {
  console.log(`Example app listening at http://localhost:${port}`)
})