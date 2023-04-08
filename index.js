const express = require('express')
const app = express()
const port = 3000
const USERS = [{
  email:"abc@gmail.com",
  password:"123$@45",
}];

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

// ensure that only admins can do that.
const Authadmin = (req, res, next)=>{
  const userrole = req.headers['x-user-role'];
  if (userrole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const {email,password} = req.body;
  // body should have email and password
  if(!email && !password){
    return res.status(400).send('The email and password not entered');
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userEmail = USERS.find(users => users.email === email)
  if(userEmail){
    return res.status(401).send('User With This email already exists')
  }
  //just to know if any user enterd the same password of other users
  const userpass = USERS.find(users => users.password === password)
  if(userpass){
    return res.status(401).send('Password is too weak. Change another or add any extra character')
  }
  USERS.push({email,password});
  // return back 200 status code to the client
  return res.status(200).send('User is successfully created');
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email,password} = req.body;
  // body should have email and password
  if(!email && !password){
    return res.status(400).send('Email and password are not found');
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userEmailandPassword = USERS.find(users => users.email === email && users.password === password);
  if(!userEmailandPassword){
    // If the password is not the same, return back 401 status code to the client
    return res.status(401).send("Email or password doesnot match");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  function generateAuthToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    return token;
  }
  const Authtoken = generateAuthToken(15);
  return res.status(200).json({Authtoken});
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  return res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   return res.status(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const {userid, problemid, code} = req.body;
   if(!userid && !problemid && !code){
    return res.status(400).send("Submission not successful");
   }
   // Store the submission in the SUBMISSION array above
   const usernewsubmission = {id:SUBMISSION.length + 7,userid,problemid,code};
   SUBMISSION.push(usernewsubmission);
   return res.status(200).json(usernewsubmission);
});

// leaving as hard todos

// Create a route that lets an admin add a new problem
app.post('/problems',Authadmin, (req,res)=>{
  //add problem
  const {title, description, testCases} = req.body;
  //Check that all are available in body or not
  if(!title && !description && !testCases){
    //send an error
    return res.status(401).send("Some required parameters are not found. Please enter the question again with all required parameters");
  }
  const newquestion = {id: QUESTIONS.length+7,title,description,testCases};
  QUESTIONS.push(newquestion);
  return res.status(200).send('Question is added successfully');
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})