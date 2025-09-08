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

app.use(express.json());
const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).send('Email and password are required');
    }
    const userExists = USERS.find(user => user.email === email);
    if (userExists) {
      return res.status(400).send('User already exists');
    }
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    USERS.push({email, password});
  
    // return back 200 status code to the client
    res.status(200).send('User registered successfully');
  } catch (error) {
    return res.status(400).send('Invalid request');
  }

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).send('Email and password are required');
    }
    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    const user = USERS.find(user => user.email === email);
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid email or password');
    }
  
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    const token = Math.random().toString(36).substring(2);
    res.status(200).send({ message: 'Login successful', token });
  } catch (error) {
    return res.status(400).send('Invalid request');
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  try{
    const {problemTitle, solution} = req.body;
    if(!problemTitle || !solution){
      return res.status(400).send('Problem title and solution are required');
    }
    const question = QUESTIONS.find(question => question.title === problemTitle);
    if (!question) {
      return res.status(400).send('Problem not found');
    }
    const isAccepted = Math.random() < 0.5; // Randomly accept or reject
    SUBMISSION.push({problemTitle, solution, status: isAccepted ? 'Accepted' : 'Rejected'});
    res.status(200).send({ message: `Submission ${isAccepted ? 'Accepted' : 'Rejected'}` }); 
  } catch (error) {
    return res.status(400).json({error: error.message});
  }

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', function(req, res) {
  // Add logic to decode body
  // body should have title, description and testCases
  try{
    const {title, description, testCases} = req.body;
    if(!title || !description || !testCases){
      return res.status(400).send('Title, description and testCases are required');
    }
    const problemExists = QUESTIONS.find(question => question.title === title);
    if (problemExists) {
      return res.status(400).send('Problem with this title already exists');
    }
    //Store the new problem in the QUESTIONS array above
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).send('testCases should be a non-empty array');
    }
    for (const testCase of testCases) {
      if (!testCase.input || !testCase.output) {
        return res.status(400).send('Each test case should have input and output');
      }
    }
    QUESTIONS.push({title, description, testCases});
    res.status(200).send('Problem added successfully');
  } catch (error) {
    return res.status(400).send('Invalid request');
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})