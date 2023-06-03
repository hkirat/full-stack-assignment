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


const SUBMISSION = [{
    question: "Two states",
    code: "function max(arr){ retur Math.max(....arr)}",
    status: "Accepted"
} ];
app.use(express.json());

//signup route
app.post('/signup', function(req, res) {
    const { email, password } = req.body;
    const user = USERS.find(user => user.email === email);

    if (!user) {
        USERS.push({ email, password });
    }
    res.status(200).send("User created");
});


// login route

app.post('/login', function(req, res) {

    const { email, password } = req.body;

    const user = USERS.find(user => user.email === email && user.password === password);

    if (user) {
        const token = Math.random().toString(36).substr(2, 16);
        res.status(200).send({ token });
    } else {
        res.status(401).send('Unauthorized');
    }
});




app.get('/questions', function(req, res) {
    const questions = QUESTIONS.map(question =>{
        const title= question.title;
        const description = question.description;
        const testCases = question.testCases;
        return{title, description, testCases}
    });

    res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
    const { problemID } = req.query;
    const submission = SUBMISSION.filter(submission => submission.problemID === problemID);
    res.status(200).json(submission);
});


app.post("/submissions", function(req, res) {
   const submissions = SUBMISSION.map(submissions=>{
       const question = submissions.question;
       const code= submissions.code;
       const status = submissions.status;
       return {question, code, status};
   })
   res.status(200).send('Submission recieved');
});

app.post('/problem', function (){
    const isAdmin = true;
    if(!isAdmin){
        res.status(403).send('Unauthorized');
        return;
    }
    const {title, description, testCases} = req.body;
    const newProblem = {title, description, testCase};
    QUESTIONS.push(newProblem);
    res.status(200).send('Problem added successfully');
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})