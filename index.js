const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
  // Add logic to decode body
  // body should have email and password
  const mail = req.body.email;
  const pswd = req.body.password;


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // checking if user alreasy exists with same email or not
  if(USERS.includes(mail)){
    res.status(400).send("Email already exists...");
   
  }else{
    const newUser = {
      email : mail,
      password : pswd
    };
    // adding new user to USERS
    USERS.push(newUser);
    res.status(200).send("Success..")
  }

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const pswd = req.body.password;

  // Check if the user with the given email exists in the USERS array
  const findUser = USERS.find(user=>user.email === email);
  if(findUser){
    if(findUser.password === pswd){
      const token="It is a random token messsage"

      res.status(200).json({token:token});
    }else{
      res.status(401).send("Incorrect password");
    }
  }else{
    res.status(401).send("User not found")
  }
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


})

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
  //return the user all the questions in the QUESTIONS array
 
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const randomNumber = Math.floor(Math.random() * 10) + 1;
   const sub ="";
   if(randomNumber > 5){
    sub = "accepted"
   }else{
    sub = "rejected"
   }
   SUBMISSION.push(req.body);
   res.send(sub);
   // Store the submission in the SUBMISSION array above
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})