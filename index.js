const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const questions = [{
    title: "Two states",
    description: "Given an array return maximum of the array",
    testCases: [{
        input: [1,2,3,4,5],
        output: [5]
    }]
}];

const users = [];
const submissions = [];

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const userExists = users.some(user => user.email === email);
    if (userExists) {
    
      return res.status(400).send('User already exists');
    }
    else
    {
        users.push({ email, password });
        console.log(users);
        return res.status(200).send('User created');
       
    }
 
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const User = users.find(user => user.email === email);
    if (!User) {
        return res.status(404).send('User not found');
      }
    
      if (User.password !== password) {
        return res.status(401).send('Incorrect password');
      }
    const token = "token_1234"
    console.log('login successful');
    res.status(200).send('Login successfully!')
    // body should have email and password
    // check if email and password match
    // return back 200 status code to the client
    // Also send a token back to the client
    //  If password doesnt match, send back 401 status code
    
  })

  app.get('/questions', (req, res) => {
   
    return res.status(200).json(questions);
    // return the user all the questions in the Questions array
  })

  app.post('/getsubmissions', (req, res) => {
    const { email, title } = req.body;
    const submission = submissions.find(submissions => submissions.email === email && submissions.title === title);
    if (!submission) {
        return res.status(404).send('Submission not found');
        }
    console.log('Submission found');
    return res.status(200).json(submission)
    // return the user all the submissions for this problem
    
  })
  app.post('/postsubmissions', (req, res) => {
    const { email, title,submission } = req.body;
    const threshold = 0.5; 
    const random = Math.random();
    var accepted=false;
    if (random < threshold) {
     accepted = false; 
  } else {
     accepted = true; 
  }
  submissions.push({email, title, submission, accepted});
  return res.status(200).send('Submission posted');
  
  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})