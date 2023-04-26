const express = require('express')
const bodyParser = require('body-parser');
const { use } = require('express/lib/application');
const app = express();
app.use(bodyParser.json());
const port = 3001
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const ADMINS = [{

}]


const SUBMISSIONS = [

]

app.post('/signup', urlencodedParser, function(req, res) {
  // Add logic to decode body
  // body should have email and password
 
  console.log(req.body);
 

  const {email, password, role } = req.body;

  const userExists = USERS.find(user => user.email === email);

  if(userExists){
  
    res.status(400).json({message: 'Email Already Exists'});
  
  }else{
   
    if(role === 'admin'){
       ADMINS.push({email, password});
     }

     USERS.push({email, password});
     res.status(201).json({ message: 'User created successfully' });

  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
});

app.post('/login', urlencodedParser, function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const {email, password} = req.body;

  const userExists = USERS.find(user => user.email === email && user.password === password);

  userExists ? res.status(201).json({message: 'Login Successful', token: Math.random().toString(36).substring(2, 12) })
              :res.status(401).json({message: 'Invalid username or password'});
  
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(201).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.status(201).json(SUBMISSIONS);
 
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  SUBMISSIONS.push(req.body);
  let randomNumber = Math.random();

  if(randomNumber > 0.2){
    res.status(200).json("Submission Accepted!");
  }
  else{
    res.status(200).json("Submission Rejected!");
  }
  
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addQuestion", function(req, res){
  
  const{email, question} = req.body;

  const adminExists = ADMINS.find(admin => admin.email === email);

  if(adminExists){
    QUESTIONS.push(question);
    res.status(200).json({'Message' : 'Question added Successfully'});
  }else{
    res.status(401).json({'Message': 'Error! Only Admins can add new Questions!'});
  }

});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})