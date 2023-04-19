const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [
        {
                input: "[1,2,3,4,5]",
                output: "5"
        },
        {
                input: "[12,34,456,1000]",
                output: "1000",
         },
      ],
    
    },
    {
        title: "reduce to array sum",
        description: "Given an array , return the sum of the array?",
        testCases: [
            {
                input: "[1,2,3,4,5]",
                output: "15",
            },
            {
                input: "[12,34,456,1000]",
                output: "12",
            },
        ],
    },
    {
        title: "find min",
        description: "Given an array , return the min of the array?",
        testCases: [
            {
                input: "[1,2,3,4,5]",
                output: "1",
            },
            {
                input: "[10,40,20,30]",
                output: "100",
            },
        ],
    },              
     ];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  const { email, password } = req.body;
  const userExists = user.find((user) => user.email === email);  

    if (userExists) {
        return res.status(409).send("User already signuped");
    }
    else {
        user.push({ email, password });
        return res.status(200).send("User account created successfull");
    }
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;
    const userExists = user.find(
        (user) => user.email === email && user.password === password
    ); // check email and password
    if (userExists) {
        const token = "randomtoken";
        res.status(200).json({ token, message: "login successfully" });
    } else {
        res.status(401).send("Invalid email or password please signup to new account !!");
    }
});

app.get('/questions', function(req, res) {
    const questiontitle = QUESTIONS.map(question => question.title);
    const questiondesc = QUESTIONS.map(question => question.description);
    const testcases = QUESTIONS.map(question => question.testCases);
    res.json({ questiontitle, questiondesc, testcases });
});

app.get("/submissions", function(req, res) {
    const { useroutput } = req.body;  
    let score = 0;
    for (let i = 0; i < QUESTIONS.length; i++) {
        for (let j = 0; j < QUESTIONS[i].testCases.length; j++) {
            if (QUESTIONS[i].testCases[j].output === useroutput) {
                score++;
            }
        }
    }
    res.json({ scrore: score })
});


app.post("/submissions", function(req, res) {
    const { problemindex } = req.body;  
    const isAccepted = Math.random() < 0.5;
    const submission = {
        problemindex: problemId,
        useroutput: useroutput,
        isAccepted: isAccepted,
    };
    SUBMISSIONS.push(submission);
    res.status(200).json({
        message: isAccepted ? "Submission accepted!" : "Submission rejected.",
    });
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})