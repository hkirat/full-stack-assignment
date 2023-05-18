const express = require("express");
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3001;

/*
Structure of user object:
{
    email: userEmail, 
    password: userPassword, 
    role : userRole
}
*/
const USERS = [];

const QUESTIONS = [
    {
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [
            {
                input: "[1,2,3,4,5]",
                output: "5",
            },
        ],
    },
];

/*
Structure of submission object:
{
    user: ,
    allSubmissions: [{
        questionTile: ,
        questionSubmissions: [{
            language:
            code:
            status: 
        }]
    }]
}
*/
const SUBMISSION = [];

app.post("/signup", function (req, res) {
    // Add logic to decode body
    const {email: userEmail, password: userPassword, role: userRole} = req.body;
    // body should have email and password
    if(!userEmail || !userPassword || !userRole){
        return res.status(406).send(`All the fields email, password, role are mandatory`);
    }
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const exists = USERS.some(ele => ele.email === userEmail);
    if(exists){
        res.status(409).send(`User ${userEmail} is already registered!`);
    }else{
        USERS.push({
                email: userEmail, 
                password: userPassword, 
                role : userRole
            });

        SUBMISSION.push({
                user: userEmail,
                allSubmissions : []
            });

        // return back 200 status code to the client
        res.status(200).send(`User ${userEmail} has been successfully registered!`);
    }
});

app.post("/login", function (req, res) {
    // Add logic to decode body
    const {email: userEmail, password: userPassword} = req.body;
    // body should have email and password
    if(!userEmail || !userPassword){
        return res.status(406).send(`Both the fields email, password are mandatory`);
    }
    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    const userObj = USERS.find(ele => ele.email===userEmail);
    if(userObj){
        if(userObj.password === userPassword){
            // If the password is the same, return back 200 status code to the client
            // Also send back a token (any random string will do for now)
            const randomStr = uuidv4();
            res.status(200).json({
                message: `Login Successful!`,
                token:  randomStr
            });
        }else{
            // If the password is not the same, return back 401 status code to the client
            res.status(401).send(`Login Unsuccessful`);
        }
    }else{
        res.status(409).send(`User ${userEmail} isn't registered. Please register first!`);
    }
});

app.get("/questions", function (req, res) {
    //return the user all the questions in the QUESTIONS array
    res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
    // return the users submissions for this problem
    const {userEmail, questionTitle} = req.body;
    const userSubmissions = SUBMISSION.find(ele => ele.user === userEmail).allSubmissions;
    const quesSubmissions = userSubmissions.find(quesSub => quesSub.questionTitle === questionTitle);
    if(quesSubmissions){
        res.send(quesSubmissions.questionSubmissions);
    }else{
        res.send(`No submissions found for this question`);
    }
});

app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const {userEmail, submission} = req.body;
    const {questionTitle, language, code} = submission;

    const userSubmissions = SUBMISSION.find(ele => ele.user === userEmail).allSubmissions;
    const quesSubmissions = userSubmissions.find(quesSub => quesSub.questionTitle === questionTitle);

    const randomStatus = Math.random() < 0.5 ? "Accepted" : "Failed";
    //construct the questionSubmission object to be pushed into the questionSubmissions array for that particular problem
    const questionSubmissionObj = {
        language: language,
        code: code,
        status: randomStatus
    }
    if(quesSubmissions){//making another submission for this problem
        quesSubmissions.questionSubmissions.push(questionSubmissionObj);
    }else{//making the 1st submission for this problem 
        userSubmissions.push({
            questionTitle: questionTitle,
            questionSubmissions: [questionSubmissionObj]
        });
    }
    res.send("Question submitted successfully!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addProblem", function(req, res){
    const {userEmail, questionObj} = req.body;
    const userObj = USERS.find(ele => ele.email===userEmail);
    if(userObj.role === "admin"){
        QUESTIONS.push(questionObj);
        res.status(200).send(`Question added successfully!`);
    }else{//User isnt admin
        res.status(403).send(`User doesnt have this privilege`);
    }
})

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
});
