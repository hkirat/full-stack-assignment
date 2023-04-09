import express from "express";
import bodyParser from "body-parser";
const app = express()
const port = 3000

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
    "title": "Sum of Array",
    "description": "Given an array , return the sum of the array?",
    "testCases": [
        {
            "input": "[1,2,3,4,5]",
            "output": "15"
        }
    ]
  }
];


const SUBMISSION = [

]
//adding middleware (are sort of inbuilt functions that give permissions to use certain expressJS features in this case) to get data from post method to a js object
app.use(express.urlencoded({extended : true}));
// middleware that extracts request body(eg - form input) and parses it into a format that can be easily used by the server application. It provides a simple way to handle different types of request body data
app.use(bodyParser.json());

//function that checks if the user is existing and the password is the same:
const authenticateUser = (email,password)=>{
  for(let i=0; i<USERS.length; i++){
    if(USERS[i].email === email && USERS[i].password === password){
      return true;
    }
  }
  return false;
};

//function that check if the user is existing:
const existingUser = (email) =>{
  if(USERS.length === 0){
    return false;
  }
  for(const user of USERS){
    if(user.email === email){
      return true;
    }
  }
  return false;
}
app.post('/signup', function(req, res) {

  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  if('email' in req.body && 'password' in req.body &&!existingUser(req.body.email)){
    USERS.push(req.body);
    console.log('New user added:', req.body);
  }
  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  // body should have email and password
  const {email, password} = req.body;
  // Checking if the user with the given email exists in the USERS array
  //if the user dosennt exist we redirect to the login page
  if(!existingUser(email)){
    return res.sendStatus(401);
  }
  // authenticating password: 
  if(authenticateUser(req.body.email, req.body.password)){
  // Also send back a token (any random string will do for now)
  //token(cookie) is sent below
    res.cookie("token","myTokenName",{
      httpOnly: true,
      expires: new Date(Date.now() + 60*2000)
    });
    // If the password is the same, return back 200 status code to the client
    return res.sendStatus(200);
  }
  
  // If the password is not the same, return back 401 status code to the client
  res.sendStatus(401)
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array in JSON format
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const submissionArray = [];
   for (const submission of SUBMISSION) {
    //assuming that each submission is an object having the property of email of the user
    if(submission.email === req.body.email){
      submissionArray.push(submission);
    }
   }
   return res.json(submissionArray);
});


app.post("/submit", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   
   //randomly accepting or rejecting the submission by choosing a random odd or even number: 
   if(Math.round(Math.random() * 10) % 2 ===0){
    SUBMISSION.push(req.body);
   }
  res.send("Thanks for the submission!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})