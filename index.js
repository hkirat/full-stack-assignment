const express = require('express');
const app = express();
const port = 3001;

const USERS = [];

const QuestionBank = [
    {
      title: 'Two states',
      description: 'Given an array, return the maximum of the array?',
      testCases: [
        {
          input: '[1,2,3,4,5]',
          output: '5',
        },
      ],
    },
  ];
const SUBMISSIONS = [];
app.post('/signup', (req, res)=> {
    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;
    if (USERS.find((user) => user.email === email)) {
      return res.status(409).send('User already exists');
    }
  
    USERS.push({ email, password });
  
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    res.sendStatus(200);
  });
  app.post('/login', (req, res)=> {
    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;
    const user = USERS.find((user) => user.email === email);
    if (!user) {
      return res.status(404).send('User not found');
    }
  
    if (user.password !== password) {
      return res.status(401).send('Invalid password');
    }
  
    // If the user with the given email exists and the password matches, send back a 200 response
    res.sendStatus(200).json({token: 'random-token'});
  });
    app.get('/questions', (req, res)=> {
        res.json(QuestionBank);
        });
app.get('submissions/:title', (req, res)=> {
    const title = req.params.title;
    const submission = SUBMISSIONS.filter((submission) => submission.title === title);
    res.json(submission);
    });
app.post('/submissions/:title', function(req, res) {
    const title = req.params.title;
    const solution = req.body.solution;
    const isAccepted = Math.random()>=0.5;
    SUBMISSIONS.push({title, solution, isAccepted});
    res.sendStatus(200);
    });
app.post('/problems', function(req, res) {
    const isAdmin = true;
    if (!isAdmin) {
        return res.status(401).send('Unauthorized');
    }
    const { title, description, testCases } = req.body;
    QuestionBank.push({ title, description, testCases });
    res.sendStatus(200);
    });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

