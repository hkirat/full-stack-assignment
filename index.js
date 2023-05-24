const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const USERS = [];
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];
const SUBMISSION = []

// Sign Up Logic
app.get('/signup', (req, res) => {
  res.sendFile(__dirname +'/signup.html');
});

app.post('/signup', function(req, res) {
  const { username, password } = req.body;


  const existingUser = USERS.find(user => user.username === username);
  if (existingUser) {
    req.send('User Already Exist!');
    return;
  }

  const newUser = {username,password};
  USERS.push(newUser);

  res.send('Sign Up Sucess!')


  res.sendStatus(200);
})

// Login Logic
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', function(req, res) {

  const { username, password } = req.body;

  const existingUser = USERS.find(user => user.username === username);
  if (existingUser) {
    if (existingUser &&  existingUser.password === password) {
      const token = '12345687'
      res.send('Login Sucessful!')
      res.sendStatus(200).json({ token });
      return;
    }
    else {
      res.status(401).send('Invalid username or password');
    }
  }
})


app.get('/questions', function(req, res) {
  for (let i = 0; i < QUESTIONS.length; i++) {
    res.send(QUESTIONS[i]);
  }
})

app.get("/subs", function(req, res) {
   // return the users submissions for this problem
   for (let i = 0; i < SUBMISSION.length; i++) {
    res.send(SUBMISSION[i]);
  }
});

app.get("/submissions/new", function(req, res) {
  // Display the submission form
  res.send(`
    <h1>Submit a Problem</h1>
    <form method="POST" action="/submissions">
      <input type="text" name="title" placeholder="Title" required /><br />
      <textarea name="description" placeholder="Problem Statement" required></textarea><br />
      <textarea name="solution" placeholder="Solution" required></textarea><br />
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
 const title= req.body.title;
 const description = req.body.description;
 const solution = req.body.solution;
 const randomAccept = Math.random() < 0.5; // Randomly accept or reject the solution

 const submission = {
   title,
   description,
   solution,
   accepted: randomAccept,
 }; 
 SUBMISSION.push(submission); // Store the submission in the SUBMISSIONS array

 res.send("Submission received!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})