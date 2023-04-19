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
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
// return back 200 status code to the client


const {email, password} = req.body;

// Check if user already exists
const existingUser = USERS.find(user => user.email === email);
if(!existingUser){
  USERS.push({email,password});
return res.status(200).json({message:'User added successfully'})
}else{
  return res.status(401).json({message:'User already exists'});
}

});

app.post('/login', function(req, res) {

  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  

  const {email , password} = res.body;

  const user = USERS.find(user => user.email === email);
  if(!user){
    return res.status(401).json({message:"email doesn't exist!"});
  }else if(password !== user.password){
    return res.status(401).json({message:"Invald password!"});
  }else{
    return res.status(200).json({message:"Logged In Successfully!", token: "Random Token #i1ockgiwaoqvrkfi231cke"});
  }
  
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);

})



app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});

// ramdomly choose a number

function randomNumber() {
  const randomNum = Math.floor(Math.random() * 2);
   if (randomNum === 0) {
    return "rejected";
  } else {
    return "accepted";
  }
}


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  
   const { problem, solution } = req.body;
  const status = randomNumber();
  SUBMISSIONS.push({ problem, solution, status });
  res.status(200).json({ status, message: "Submission received." });

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }else{
    const { text } = req.body;
  const id = PROBLEMS.length + 1;
  const newProblem = { id, text };
  PROBLEMS.push(newProblem);
  res.status(201).json(newProblem);
       }
  
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})