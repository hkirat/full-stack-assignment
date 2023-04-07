const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
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

//this middle-ware provide the appropriate formate of the the data so that we can use it.
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  
  //to access the form input we are using the body parser middleware read about it before using it 
  if(! USERS.find(user=> user.email=== req.body.email))
  {
    USERS.push({ email: req.body.email,
                 password: req.body.password
    })
    return res.json(200,{message:'signup successful'});
  }
  return res.json(401,{message:'user already exist'});
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const checkUser=USERS.find(user=> user.email === req.body.email);
  
  if(checkUser){
      if(checkUser.password===req.body.password)
      {
        return res.json(200,{message:'login successful'});
      }
        return res.json(401,{message:'invalid username/password'});
  }
  return res.json(401,{message:'invalid username/password'});
})


app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(300,{result:QUESTIONS});
})


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   if(Math.random() < 0.4) {
    SUBMISSION.push(req.body);
    return res.json(200,{message:'submission accepted'});
  }
  return res.json(402,{message:'Test case failed'});
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})