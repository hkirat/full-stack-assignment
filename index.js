const express = require('express')
const parser = require('body-parser')
const session = require('express-session')
const app = express()
app.use(parser.json())
app.use(session({
  secret: 'someSecretKey',
  resave: false,
  saveUninitialized: false
}));
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
  try 
  {
    if(req.body.email!==undefined){
      const email = req.body.email;
    const password = req.body.password;
      req.session.email = email;
    if(!(USERS.some(user=>user.email === email))){
    USERS.push({email,password});
    res.status(200).send(`${email} added!`)
  }
  else{
    res.send('User Exists!')
  }
  }
  else{
    res.send('Fill the fields.')
  }
    }
     catch (error) {
    res.status(404).send(`Error: ${error}`)
  }
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  try {
    const email = req.body.email
  const password = req.body.password
  if(USERS.some(user=>user.email===email && user.password===password)){
    token = "thisIsAValidToken!!!"
    req.session.email = req.body.email;
    res.status(200).send(`You have successfully logged in! Here is your token: ${token}`)
  }
  else if(USERS.some(user=>user.email===email && user.password!==password)){
    res.status(401).send('Incorrect password! Try again')
  }
  else if(USERS.some(user=>user.password===password &&user.email!==email)){
    res.status(401).send('Incorrect email! Try again')
  }
  else{
    res.status(401).send("User doesn't exist. Please sign up!")
  }
  } catch (error) {
    res.status(404).send(`Error: ${error}`)
  }
  

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.status(200).json(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   if(req && req.body){
    const submissions = req.body.submissions
    const rand = Math.random()*10
    if(rand>5){
      SUBMISSION.push(submissions)
      res.status(200).send('Your submission got accepted!')
    }
   else{
    res.status(404).send('Your submission got rejected! Try again')
   }
  }
});


app.post('/newquestions',(req,res)=>{
    // leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
try {
  if(USERS.length===0){
    res.status(404).send('Please login to continue');
  }
  else if(req?.session?.email !== undefined && req?.session?.email==='admin'){
    const [{title,description,testCases:[{input,output}]}] = req.body;
    QUESTIONS.push({title,description,testCases:{input,output}});
    res.status(200).send('Question added successfully!');
  }
  else{
    res.status(404).send('Only admins can add new questions');
  }
} catch (error) {
  res.status(400).send(`Error: ${error}`);
}

});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})