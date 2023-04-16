const express = require('express')
const app = express()
const PORT = 3005

const USERS = [];
const SUBMISSION = []



app.get('/',(req,res)=>{
    res.send("Helo World")
})

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

app.use(express.json())


//authentication middleware
const verifyAuthentication = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    let loggedIn = false
    for(let i=0;i<USERS.length;i++){
        if(USERS[i].email === email && USERS[i].password === password){
            loggedIn=true;
            const user = USERS[i];
            if(loggedIn){
            req.user = user;
            next()
            }
        }
    }
    res.status(400).json("You are not authorized")
}

//ADMIN Authorization 
const verifyAdminAuthentication = (req,res,next)=>{
    verifyAuthentication(req,res,()=>{
        if(req.body.isAdmin){
            next()
        }
        else{
            res.status(409).json("You are not admin")
        }
    })
}

//these endpoints will work fine when user details also included in the body

//signup
app.post('/signup',(req,res)=>{
    const user = {
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        isAdmin : req.body.isAdmin
    }
    let userExists = false;
    for(let i=0;i<USERS.length;i++){
        if(USERS[i].username===user.username && USERS[i].email===user.email && USERS[i].password === user.password){
            userExists = true;
            break;
        }
    }
    if(userExists){
        return res.status(201).json("The user already exists")
    }
    USERS.push(user)
    console.log(USERS);
    return res.status(200).json(user)
})

//login
app.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    for(let i=0;i<USERS.length;i++){
        if(USERS[i].email === email && USERS[i].password === password){
            return res.status(200).json("logged in successfully")
        }
    }
    return res.status(400).json("wrong credentials")
})

//questions
app.get('/question',verifyAuthentication,(req,res)=>{
    res.json(QUESTIONS)
})

app.post('/addquestion',verifyAdminAuthentication,(req,res)=>{
    const question = req.body.question;
    try {
        QUESTIONS.push(question);
        res.status(200).json(QUESTIONS)
    } catch (error) {
        res.status(400).json(error)
    }

})


//Post submission
app.post('/submission',verifyAuthentication,(req,res)=>{
    const title = req.body.title;
    const ans = req.body.ans;
    try {
        const isAccepted = Math.random()>=0.5;
        SUBMISSION.push({title,ans})
        res.status(200).json({isAccepted})
    } catch (error) {
       res.status(400).json(error) 
    }
})


//Get submission
app.get('/submission',verifyAuthentication,(req,res)=>{
    const title = req.query.title;

    // filter the SUBMISSION array to include only submissions for the requested problem title
    const submissionForProblem = SUBMISSION.filter(submission => submission.title === title);

    // return the filtered submissions array to the client
    res.json(submissionForProblem)
})


app.listen(PORT,()=>{
    console.log("Backend server start at",PORT);
})