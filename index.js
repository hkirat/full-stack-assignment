const express = require('express')
const app = express()
const port = 3001

// functions
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateToken(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const statuses = ["Accepted", "Rejected"];
function randomStatus(){
    let result = statuses[Math.floor(Math.random()*2)];
    return result;
}


// uid, username, password
const USERS = [];

// title, statement, testCases
const QUESTIONS = [{
    title: "Two states",
    statement: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


//title, code, status(accepted/rejected)
const SUBMISSION = [

]

// signup page, i/p : user, pass ; o/p: saves username, password in User db (after making checks whether users is in db or not)
app.post('/signup', function(req, res) {
    // checking users existence in database
    let exists = 0;
    for(let i = 0; i<USERS.length; i++)
    {
        if(USERS[i].username === req.body.username){exists = 1}
    }
    
    // saving its data in db if it doesn't exists, else notifying them 
    if(exists === 1)
    {
        res.status(400).send("Already exists")
    }
    else
    {
        let Users_obj = {
                            uid : USERS.length +1,
                            username : req.body.username,
                            password : req.body.password
                        }

    USERS.push(Users_obj);
    res.status(200).send(USERS);
    }
});

// login page, i/p : user, pass ; o/p: token, logs in user (after checking if user exists, user and pass is correct)
app.post('/login', function(req, res) {
    
    let token = generateToken();
    
    for(let i = 0; i < USERS.length; i++)
    {
        if(USERS[i].username === req.body.username && USERS[i].password === req.body.password)
        {
            res.status(200).send({token: token, message: "User is successfully logged in!"});
        }
    }
    res.status(401).send("User doesn't exists");
});

// questions page, i/p : NULL ; o/p : all questions in db
app.get('/questions', function(req, res) {
    Ques = "";
    QUESTIONS.forEach((singleQues,idx)=>{
        Ques += singleQues.title;
        Ques += '\t';
        Ques += singleQues.statement;
        Ques += '\n';
    });

    res.send(Ques);
  //return the user all the questions in the QUESTIONS array
})

// submissions page, i/p : question "title"; o/p: all the submission corresponding to "title"
app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
    
    let title = req.body.title;
    let submissions = "";
    SUBMISSION.forEach((eachSubmission, idx)=>{
        if(eachSubmission.title === title)
        {
            submissions += eachSubmission.title;
            submissions += "\t";
            submissions += eachSubmission.code;
            submissions += "\t";
            submissions += eachSubmission.status;
            submissions += "\t";
            submissions += eachSubmission.time;
            submissions += "\n";
        }
    });
    res.status(201).send(submissions);
});

// submission page, i/p: title, code ; o/p: status , (---- saves submission in SUBMISSION db ----)
app.post("/submissions", function(req, res) {
    let time_obj = new Date();
    let result = randomStatus();  // gives accepted or rejected randomly
    SUBMISSION.push({title: (req.body.title),code: (req.body.code),status: (result), time: (`Day: ${time_obj.getDate()}-${time_obj.getMonth()}-${time_obj.getFullYear()}, Hrs: ${time_obj.getHours()}:${time_obj.getMinutes()}:${time_obj.getSeconds()}}`)});
    res.status(201).send(`Your code has been ${result}, ${SUBMISSION}`);
    

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});
