const express = require('express')
const app = express()
const bodyParser  = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();
app.use(bodyParser.json());
const port = 3001

const USERS = [
  {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "Admin"
  }
];

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
  //Extract Email and password from response body 
  const email = req.body.email;
  const password = req.body.password;

  // Check if user already exist or not by checking email as Unique entity 
  const existingUser =  USERS.find(user => user.email === email);

  if(existingUser){
      res.status(409).send('User already exists');
  }
  // add new user USERS array
  USERS.push({email: email, password:password, role: "User"});

  //Return the a success response
    res.status(200).send('Signup Successfully'); 
})

app.post('/login', function(req, res) {

  //Extract Email and password from response body 
  const email = req.body.email;
  const password = req.body.password;

  //check if user exist
  //check if user password credentials matches with user password
  const user = USERS.find(user =>  user.email=== email);

  if(!user && user.password !== password){
    return res.status(401).send('Invalid email or password');  
  }

  // //random token string
  const token = email +"_"+ Math.floor((Math.random() * 10000) + 1);
  
  res.set('token',token)
  res.status(200).send(`successfully Logged In: ${token}` );
})

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const question_title = req.body.title;
   const code = req.body.code;
   const user_email = req.body.email; 
   const code_output =  req.body.output; 
   
  // find if question exist or not 
  const question = QUESTIONS.find(question => question.title === question_title);
  // now we need all the test case for this code
  const testCases = question.testCases;
  const results = testCases.map(testCase => {
    const output = testCase.output;
    return code_output === output; 
  })
  const isAccepted = results.every(result => result == true);

  const submission = {
    question: question,
    isAccepted: isAccepted,
    code: code,
    user_email: user_email
  }
  SUBMISSION.push(submission)

  res.status(200).json( {message: isAccepted ? 'Solution accepted!' : 'Solution rejected'});
});


app.post('/questions', function(req, res) {
  const questionTitle = req.body.title;
  const questionDescription = req.body.description;
  const questionTestCase = req.body.testCase;

  const user = USERS.find(user => user.role === 'Admin');
  if (!user) {
    return res.status(403).send('Forbidden');
  }

  const question = {
    title: questionTitle,
    description: questionDescription,
    testCases: questionTestCase
  }

  QUESTIONS.push(question);
  res.status(200).send('Question created successfully');

})



// listening 
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})