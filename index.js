const express = require('express')
const app = express()
const port = 3000

const USERS = [

];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];
app.use(express.json());

const SUBMISSION = [

]

app.post('/signup', function(req, res) {
 
  // Decode the request body
  console.log(req.body)
  const { email, password,role } = req.body;

  // Check if the user already exists
  const userExists = USERS.some(user => user.email === email);

  // If the user already exists, return a 409 status code
  if (userExists) {
    res.status(409).send('User already exists');
    return;
  }

  // Otherwise, create a new user with the given email and password
  USERS.push({ email, password ,role});
  console.log(USERS)


  // Return a 200 status code to the client
  res.status(200).send('User created successfully');
});
app.get('/users', function(req, res) {
  res.json(USERS);
});


const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';

function generateToken(email) {
  const payload = { email };
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  return token;
}


app.post('/login', function(req, res) {
  // Extract email and password from request body
  const { email, password } = req.body;

  // Find user with matching email in USERS array
  const user = USERS.find(user => user.email === email);

  // If user is not found, return 401 Unauthorized status code
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // Check if password is correct
  if (user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  // Generate and send token to client
  const token = generateToken(email); // implement function to generate token
  res.json({ token });
});


app.get('/questions', function(req, res) {
 
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})




app.post("/submissions", function(req, res) {
 // simulate random acceptance or rejection
const isAccepted = Math.random() >= 0.5;

// get the submitted problemn from the request body
const submittedProblem = req.body.problem;

// create a new submission object
const submission = {
  problem: submittedProblem,
  isAccepted: isAccepted
};

// add the submission to the SUBMISSION array
SUBMISSION.push(submission);

// send the response to the client
res.send(submission);

});
 app.get("/submissions",function(req,res){
  res.json(SUBMISSION);
 })


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// Define a middleware function that checks if the user is an admin
function isAdmin(req, res, next) {
  // Get the user's email and password from the request headers
  const email = req.headers.email;
  const password = req.headers.password;

  // Find the user in the USERS object based on their email and password
  const user = USERS.find(user => user.email === email && user.password === password);

  // Check if the user is an admin based on their role
  if (user && user.role === 'admin') {
    // If the user is an admin, call the next middleware function
    next();
  } else {
    // If the user is not an admin, return a 401 Unauthorized response
    res.status(401).send('Unauthorized');
  }
}

// Define a route that allows an admin to add a new problem
app.post('/problems', isAdmin, (req, res) => {
  // Here you can add your code to handle the problem creation
  // For example, you might parse the problem data from the request body
  const newProblem = req.body.problem;

  // Then you can add the problem to your database or array
  // For example, you might push the problem to a PROBLEMS array
  QUESTIONS.push(newProblem);

  // Finally, you can send a response to the client
  res.send('Problem created');
});
app.post('/problems',function(req,res){
  res.json(QUESTIONS);
})



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})