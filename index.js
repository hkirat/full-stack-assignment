const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3001

const USERS = [
  {
    name: "Arun",
    email: "qwerty@123.com",
    password: "123456",
    role: "admin",
    submissions: 0,
    questions:[],
    submissions: []
  }
];

const QUESTIONS = [{
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  id: 2,
  title: "Distinct States",
  description: "Given an array , return the Distinct elements of the array?",
  testCases: [{
      input: "[1,1,2,2,3,3,4,5,6,3,7,8,9,9]",
      output: "[4,5,6,7,8]"
  }],
}
];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if(USERS.find(user => user.email === email)){
    res.send("User already exists");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  USERS.push({name,email,password});

  // return back 200 status code to the client
  res.status(200).send('User created successfully');
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const email = req.body.email;
  const password = req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email);
  if(user == null){
    res.sendStatus(400).send("User not exists Please Signup.");
  }
  if(user.password == password){
    res.sendStatus(200).send("waidqoadn282qeu3owifbiasndownaldnwalwiahdiawszbxiaksisi");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.sendStatus(401)
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(USERS.submissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const email = req.body.email;
   const questionId = req.body.questionId;
   const isSolved = req.body.isSolved;
   if(isSolved){
    USERS.get(email).QUESTIONS.push(questionId,isSolved);
   }
   USERS.get(email).SUBMISSION.push(questionId,isSolved);
   SUBMISSION.push({email,questionId,isSolved});
  res.sendStatus(200)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/add-questions", function(req,res){

  const email = req.body.email;
  const user = USERS.find(user => user.email === email);
  const question = req.body.question;
  if(user.role == 'admin'){
    QUESTIONS.push(question);
    res.sendStatus(200).send("Question added successfully");
  }
  res.sendStatus(401).send("You dont have access to add question");

})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})