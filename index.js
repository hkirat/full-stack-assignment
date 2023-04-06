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

console.log(SUBMISSION)

app.use(express.urlencoded({extended:true}));

app.post('/signup', function(req, res) {
  
  const email = req.body.email;
  const password = req.body.password;

 
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    return res.status(409).send('User already exists!');
  }
  const id = USERS.length+1;
  USERS.push({ id,email, password});
  res.status(200).send('welcome');
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

 
  const token = Math.random().toString(36).substring(2);

  
  user.token = token;

  res.status(200).json({ token });
})




app.get('/questions', function(req, res) {
  res.status(200).send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
  
   const token = req.headers.authorization;

  const user = USERS.find(user => user.token === token);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const problemId = req.query.problemId;
  const submissions = SUBMISSION.filter(submission => submission.userId === user.id && submission.problemId === problemId && submission.solution);
  res.status(200).send(submissions);
  

});




app.post("/submissions", function(req, res) {
  
  const token = req.headers.authorization;

 
  const user = USERS.find(user => user.token === token);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  
  const { problemId, solution } = req.body;

  
  const isAccepted = Math.random() < 0.5;

 
  const newSubmission = {
    id: SUBMISSION.length + 1,
    userId: user.id,
    problemId,
    solution,
    isAccepted
  };
 
  SUBMISSION.push(newSubmission);
  console.log(SUBMISSION)
  res.status(200).send({
    message: isAccepted ? 'Solution accepted' : 'Solution rejected',
    submission: newSubmission
  });
  
});







app.post('/problems', function(req, res) {
 
  const token = req.headers.authorization;

 
  const user = USERS.find(user => user.token === token && user.isAdmin);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const newProblem = req.body;
  QUESTIONS.push(newProblem);

  res.status(200).send('Problem added successfully');
});






app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})