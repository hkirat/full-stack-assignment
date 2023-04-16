const express = require('express')  //importing expressjs module
const app = express()     
const port = 3000

const USERS = [{
  email: 'abc@gmail.com',
  password: 'abc',
  role: 'admin'
}];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array, return the maximum of the array ",
  testcases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSION = [{
  
}]

app.post('/signup', function(req, res){
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Check if a user with the same email already exists in the users array
  const userExists = USERS.some(user => user.email === email);

  // If a user with the same email already exists, return a 409 Conflict status code with an error message
  if (userExists) {
    return res.status(409).send('User with this email already exists');
  }

  // If the email is unique, add the new user to the users array
  const newUser = { email, password };
  USERS.push(newUser);

  // Return a 200 OK status code with a success message
  res.status(200).send('User signed up successfully!');
});


app.post('/login', function(req, res){ 
  // Get email and password from the request body
  const { email, password } = req.body;

  // Find the user with the given email in the users array
  const user = USERS.find(user => user.email === email);

  // If no user was found or the password is incorrect, return a 401 Unauthorized error
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  // If the email and password are correct, generate a token and return a 200 OK response with the token
  const token = generateToken(user);
  return res.status(200).json({ token });
  
});


app.get('/questions', function(req, res){
    res.send('Wait for questions')
    res.send(QUESTIONS);
})

app.get('/submissions', function(req,res){
    res.send(SUBMISSION);
})

 
app.post('/submissions', function(req, res){
    //let the users submit a problem, randomly accept or reject the solution
    //Store the submission in the submission above

    // Extract the problem and solution from the request body
    const { problem, solution } = req.body;
  
    // Randomly accept or reject the solution
    const isAccepted = Math.random() < 0.5;
  
    // Add the submission to the submissions array
    const newSubmission={     // Create a new submission object
      id:SUBMISSION.length+1,
      problemId:problemId,
      solution:solution,
     isAccepted:isAccepted
    }
    SUBMISSION.push(newSubmission);
  
    // Return a response indicating whether the submission was accepted or rejected
    if (isAccepted) {
      res.status(200).send('Your submission was accepted!');
    } else {
      res.status(400).send('Your submission was rejected.');
    }
});

//leaving as har to dos:
//Create a route that lets admins add a new problem
//Ensure only admins can do that
app.post('/problems', function(req, res){
  // Extract the email and password from the request headers
  const { email, password } = req.headers;

  // Find the user with the matching email and password
  const user = USERS.find(u => u.email === email && u.password === password);

  // If the user is not an admin, return an error response
  if (!user || user.role !== 'admin') {
    return res.status(401).send('You are not authorized to perform this action.');
  }

  // If the user is an admin, add the new question to the QUESTIONS array
  QUESTIONS.push(req.body);

  // Return a success response
  res.status(200).send('Question added successfully.');
});



app.listen(port, function(){
  console.log(`Example app listening on port ${port}`)
})
