const express = require('express') //importing express project
const app = express() //creating an instance of express
const port = 3000 //creating a port for comm

//app.use(express.json)
app.use(express.urlencoded({extended : false}));

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
    const details = {email, password} = req.body
    var found = false
    USERS.forEach(element => {
        if (element.email === details.email){
         found = true
         return res.status(400).json({ error: 'User already exists.' });
        }
    });
    if(found == false){
        USERS.push(details)
        console.log(details)
        return res.status(200).json({message:'User signup successful'})
    }
})

app.post('/login', function(req, res) {
    const details = {email, password} = req.body
    USERS.forEach(element => {
        if(details.email === element.email){  // user exists
            if(details.password === element.password){  //password matches
                return res.status(200).json({message:'Logged in'})
            }else{
                return res.status(400).json({message:'wrong password'})
            }
        }
    });
    return res.status(401).json({message:'user does not exist'})
})

app.get('/questions', function(req, res) {
    res.send(QUESTIONS)

})

app.get("/submissions", function(req, res) {
    res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
    const submission = { question, answer } = req.body
    var random = Math.random()
    if(random>0.5){
        SUBMISSION.push(submission)
        console.log('submission accepted')
        return res.status(200).json({message:'submission accepted'})
    }
    console.dir(req.body)
    res.status(401).json({message:"submission not accepted"})
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})