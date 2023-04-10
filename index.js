const express = require('express')
const app = express()
app.use(express.urlencoded({extended:true}))
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
 
    const { email, password } = req.body;
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send('User already exists');
  }
  USERS.push({ email, password });
  res.sendStatus(200);
})

app.post('/login', function(req, res) {
     const { email, password } = req.body;
    
    const user = USERS.find(user => user.email === email);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
   
    if (user.password !== password) {
      return res.status(401).send('Invalid email or password');
    }
   
    const token = 'randomToken'; 
    res.status(200).send({ token });

})

app.get('/questions', function(req, res) {
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   const { email, questionTitle, solution } = req.body;
    const question = QUESTIONS.find(question => question.title === questionTitle);
    if (!question) {
      return res.status(404).send('Question not found');
    }
  
    const testCase = question.testCases[0]; 
    const expectedOutput = testCase.output;
    const actualOutput = solution; 
    const isCorrect = expectedOutput === actualOutput;
  
    SUBMISSION.push({ email, questionTitle, solution, isCorrect });
  
    
    if (isCorrect) {
      res.send('Correct solution');
    } else {
      res.send('Incorrect solution');
    }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
