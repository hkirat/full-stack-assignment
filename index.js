const express = require('express')
const app = express()
app.use(express.json());
const port = 3001

const USERS = [];

const ADMIN = [{
  username: 'admin',
  password: 'password123',
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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  
  
  // body should have email and password
  

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const { email, password } = req.body;
  const existingUser = USERS.find(user => user.email === email);

  if (existingUser) {
    res.status(400).send('User with email already exists');
    return;
  }

  USERS.push({ email, password });
  
  // return back 200 status code to the client
  res.status(200).send('User registerd successfully');


  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email && user.password === password);

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if (!user) {
    
    return res.status(401).send('Invalid email or password');
  } else{
    return res.status(200).send("kjvbnqeiubveqiubvioqenvoiqnvceoicn");
  }


  
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const submission = req.body;
  SUBMISSION.push(submission);
  res.status(200).send("submitted");
}); 





// Middleware to check if user is an admin
function isAdmin(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const admin = ADMIN.find(admin => admin.username === username && admin.password === password);
  if (admin) {
    // User is an admin
    return next();
  } else {
    // User is not an admin
    return res.status(401).send('Unauthorized');
  }
}


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/problems', isAdmin, (req, res) => {
  const newProblem = req.body.problem;
  QUESTIONS.push(newProblem);
  res.send('Problem added successfully');
});



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})