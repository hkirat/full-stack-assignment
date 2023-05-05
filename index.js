const express = require('express')
const app = express()
const port = 3000

const USERS = [];

const QUESTIONS = [{
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}



app.post('/signup', function(req, res) {
    // Add logic to decode body
    // body should have email and password
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).send('Please provide email and password');
    }
    if(USERS.find(e=> e.email === email))return res.status(409).send('User already exists');

    USERS.push({email, password, });

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)


    // return back 200 status code to the client
    res.status(201).send('User created successfully.');
})

app.post('/login', function(req, res) {
    // Add logic to decode body
    // body should have email and password
    const {email, password} = req.body;
    if(!email ||!password) {
        return res.status(400).send('Missing Credentials');
    }

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same

    if(!USERS.find(e => e.email === email && e.password === password))return res.status(401).send('Invalid Credentials.');

    // return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const createdToken = generateRandomString(20);
    res.status(200).json({
        status: 'success',
        message: 'You have successfully logged in!',
        token: createdToken,
    })
})

app.get('/questions', function(req, res) {

    //return the user all the questions in the QUESTIONS array
    res.status(200).json({
        status:'success',
        questions: QUESTIONS
    })
})

app.get("/submissions", function(req, res) {
    // return the users submissions for this problem
    res.status(200).json({
        status:'success',
        submissions: SUBMISSION
    })
});


app.post("/submissions", function(req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const{questionId, solution} = req.body;
    if(!questionId || !solution)return res.status(400).send('Missing Fields!');
    if(!QUESTIONS.find(q => q.id === questionId)) return res.status(401).send('Question not found!');
    const isAccepted = Math.random()>=0.5;
    SUBMISSION.push({
        questionId,
        solution,
        isAccepted,
        createdAt: new Date()
    })
    return res.status(200).json({
        message: "Successfully created the submission",
        id: questionId
    })
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.listen(port, function() {
    console.log(`Example app listening on port ${port}`)
})
