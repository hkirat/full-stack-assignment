const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express()
const cors = require('cors');
const port = 3001

app.use(bodyParser.json()); // added to read json data from request body
app.use(cors()); // added to avoid CORS policy error
const USERS = [{userName : 'admin', password : 'admin', isAdmin : true}];
const user = {userName : 'admin', password : 'admin', isAdmin : true};
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'random string',
  resave: false,
  saveUninitialized: false,
}));

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  {subId :1,solution :'this is solution code for submission 1'},
  {subId :2,solution :'this is solution code for submission 2'}
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const {userName,password,isAdmin} = req.body;
   // body should have email and password
   //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(USERS.find(user => user.userName === userName)){
    res.status(409).send('User with  user name '+userName+' already Exists!\nPlease login with your credentials!');
  }
  else{
    USERS.push({userName: userName, password: password, isAdmin:isAdmin});
    // return back 200 status code to the client
    //res.status(200);
    res.status(200).send('Thank you '+userName+'! \n You have successfully registered!');
  }
  
});


  app.post('/login', function(req, res) {
  // Add logic to decode body
     // body should have email and password
  const {userName,password} = req.body;
  let uid = 0;
  const token = Math.random().toString(36).substring(2);

  // Check if the user with the given email exists in the USERS array
  uid = USERS.findIndex(user => user.userName === userName);

  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  if(uid != -1 && password == USERS[uid].password){
    let user = {userName: userName, password: password, isAdmin: USERS[uid].isAdmin};
    req.session.isAdmin =  user.isAdmin;
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).send('Welcome '+userName+'!');
  }
  else{
    res.status(401).send('User doesn\'t exist or password is incorrect!');
  }
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  //let arr = [QUESTIONS,req.headers];
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
});

app.post('/addQuestions',function(req, res){
  if(req.session.isAdmin){
    res.status(200).send('Questions Added');
  }else{
    res.status(403).send('Only admins can add questions');
  }
    
})


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Demo application is listening on port ${port}`)
})