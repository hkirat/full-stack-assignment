const express = require('express');
const { restart } = require('nodemon');
const app = express();

const port = 3001;
const users= [{
    email: 'anpch@example.com',
    password: '123456',
}];

const submissions = [
    {
        userId: '1',
        questionId: '1',
        code: 'function maximum() { return}; }',
        status: 'accepted',
    },
    {
        userId: '1',
        questionId: '2',
        code: 'function maximum() { return}; }',
        status: 'rejected',
    }
]

const questions = [{
    title: 'two sums',
    description: 'Given two integers, return their sum',
    testCases: [{
        input: "[2, 7]",
        output: "9",
    }]
}];

const generateRandomString = (length) => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters[Math.floor(Math.random() * characters.length)];
    }
    return randomString;
}

app.get('/', function(req, res) {
    res.send('LeetCode');
});

app.post('/signup', function(req, res) {
    const { email, password } = req.body;
    const newUser = { email:email, password: password };
     //validation
     if (!email || !password) {
        return res.status(400).json({message: 'Please provide all the required fields'})
     }
     if (users.find(obj => obj.email === email)) {
        return res.status(400).json({message: 'You are already registered as a user'});
     }
     
     users.push(newUser);
     res.status(201).json({message: 'User registered successfully'});
});

app.post('/login', function(req, res) {
   const { email, password } = req.body;
   if (!email || !password) {
    return res.status(400).json({message: 'Please provide all the required fields'})
    }

   if (users.find(obj => obj.email === email && obj.password === password)) {
        const token  = generateRandomString(12);
        res.status(200).json({token: token, message: 'You logged in successfully'});
    }
    res.status(401).json({message: 'User credentials are invalid'});

})

app.get('/questions', function(req, res) {
    res.send('Questions!');
    res.json(questions);
})

app.get('/submissions', function(req, res) {
    //return users submissions
    res.json(submissions);
});

app.post('/submissions', function(req, res) {
    const { userId, questionId, code, status } = req.body;
    const submission = { userId, questionId, code, status };
    if (status === 'accepted') {
        submissions.push(submission);
        res.status(200).json({message: 'Submission accepted'});
    } 
    alert('Submissions Failed!')
    res.status(200).json({message: 'Submission failed'});
});

app.post('/addProblems', function(req, res) {
    const { role, problem } = req.body;
    if (!role || problem) res.status(401).json({message: 'Role and problem statement is required'});
    const admin = role === 'admin';
    if (admin) {
        const { title, description, testCases } = problem;
        if (!title || !description || !testCases) res.status(401).json({message: 'something went wrong'});
        questions.push(problem);
    }
});

app.get('/admin', function(req, res) {
    res.send(
        `<html>
            <body>
                <h1 style="color: blue">Admin Pannel</h1>
            </body>    
        </html>`);
});

app.listen(port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
});
