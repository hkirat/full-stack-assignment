const express = require('express')
const app = express()
const port = 3001

app.use(express.json());


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

  const { email, password } = req.body;

  const userExists = USERS.some(user => user.email === email);
  if (userExists) {
    return res.status(400).send('Email already exists');
  }

  USERS.push({ email, password });


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  res.sendStatus(200);



  

})


app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const {email, password} = req.body;

  


  const user = USERS.find(user => user.email === email);
  if (user && user.password === password) {
    const token = 'random-token';
    return res.status(200).json({ token });
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.sendStatus(401);
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  if(SUBMISSION.length == 0){
    res.status(401).json({message: 'SUBMISSIONS array is empty'})
  }
   // return the users submissions for this problem
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
  let token = req.headers.token;
  if(!token){
    res.status(401).json({message: 'no token in headers'})
  }

  const {question, solution, tests} = req.body;
  const acceptOrRejectSolution = getRandomBoolean();
  const status = acceptOrRejectSolution ? 'ACCEPTED' : 'REJECTED';
  console.log(status);
  if (status == 'ACCEPTED'){
    SUBMISSION.push({question, solution, tests});
    res.status(200).json({message:'SUBMISSION ACCEPTED', token:token});
  }
    res.status(401).json({message:'SUBMISSION REJECTED'});
  

   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

});

function getRandomBoolean() {
  return Math.random() < 0.5; // Returns true approximately 50% of the time
}


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
