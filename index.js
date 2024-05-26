const express = require('express')
const app = express()
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
    const {username, email, password} = req.body;
    try{
         let emailExists = USERS.some(user => user.email === email);
    if(!emailExists){
          USERS.push({username: username, email:email, password:password})
          res.status(201).json({'User created'})
    }else{
         res.status(409).json({ error: 'user with this email already exists' });
    }
    }catch(error){
        res.status(500).json({ error: 'An error occured' });
}})


app.post('/login', function(req, res) {
    {email, password} = req.body;
     function generateRandomString(length) {
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     let randomString = '';
      for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return randomString;
     }
    
    const token = generateRandomString(10);
    let emailPassExists = USERS.some(user => user.email === email && user.password === password);
    if(emailPassExists){
        res.status(201).json(token)
    }else{
        res.status(401).send('Invalid email or password');
    }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
