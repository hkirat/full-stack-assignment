const express = require('express')

const app = express()
app.use(express.json());

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

app.post('/signup', function(req, res) {

  const existUser = USERS.find(s => s.email === req.body.email);

  if(existUser) {
    return res.status(409).send({ message: 'User alredy exist!' })  ;
  }

  if(req.body.role) {
    req.body.role === 'user';
  }

  USERS.push(req.body);
  res.status(201).send(req.body);

})

app.post('/login', function(req, res) {

  const existUser = USERS.find(s => s.email === req.body.email);

  if(!existUser) {
    return res.status(401).send({ message: "user doesn't exist" })
  };

  const matchesPassword = existUser.password === req.body.password;

  if(!matchesPassword) {
    return res.status(401).send({ message: "Password doesn't match" });
  } 

  // token generation
  let token = (Math.random() + 1).toString(36).substring(7);

  // saperate token for admin
  if(existUser.role === 'admin') {
    token = 'admin' + token;
  }

  res.status(200).send({ data: { token } });

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send({ data: SUBMISSION });
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

  const randomId = Math.floor(Math.random() * 2);

  let obj = { code: req.body.code };

  if(randomId){
    obj.status = 'accepted';
  } else {
    obj.status = 'rejected';
  }

  SUBMISSION.push(obj);
  res.send({ data: obj });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/questions", function(req, res) {
  // user validation
  const token = req.headers['token'];
  if(!token){
    return res.status(401).send({ message: 'Token not found' });
  }
  if(!token.match('admin')) {
    return res.status(401).send({ message: 'You are unauthorized to perform this task' });
  }
  QUESTIONS.push(req.body);
  res.status(201).send({ message: 'Question added successfully!' });
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})