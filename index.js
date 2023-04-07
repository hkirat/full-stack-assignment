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


const SUBMISSION = [

]

app.post('/signup', function (req, res) {



    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;

    // check user exists or not
    const isUserExist = USERS.find((curUser) => {
        if (curUser.email == email) {
            return true
        }
    })

    // if user exists send error msg
    if (isUserExist) {
        res.status(400).json({ msg: "user already exists" })
    }


    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    USERS.push({ email, password })



    // return back 200 status code to the client
    res.status(200).json({ msg: "User Created Succesfully" })
})

app.post('/login', function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;


    // Check if the user with the given email exists in the USERS array

    const isUserExist = USERS.find((curUser) => {
        if (curUser.email == email) {
            return curUser
        }
    })

    if (isUserExist) {

        // Also ensure that the password is the same
        if (isUserExist.password == password) {

            const token = Math.random();

            // If the password is the same, return back 200 status code to the client
            // Also send back a token (any random string will do for now)
            res.status(200).json({ msg: "User Login Succesfull", token: token })
        }
        else {
            // If the password is not the same, return back 401 status code to the client
            res.status(401).json({ msg: "Wrong Credentials" })
        }

    }else{
        res.status(401).json({ msg: "Wrong Credentials" })
    }


})

app.get('/questions', function (req, res) {


    //return the user all the questions in the QUESTIONS array
    res.status(200).json({questions:QUESTIONS})
})

app.get("/submissions", function (req, res) {
    // return the users submissions for this problem
    res.status(200).json({submissions:SUBMISSION})
});


app.post("/submissions", function (req, res) {

    const {question , answer} = req.body;

    SUBMISSION.push({question , answer});

    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    res.status(200).json({msg:"Submission Saved"})
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/add-question" ,  (req,res)=>{


    const {question , correctanswer , email} = req.body;

    const isUserExist = USERS.find((curUser) => {
        if (curUser.email == email) {
            return curUser
        }
    })

    if(isUserExist){

        // we can check if user logged in as admin by comparing its userType
        // if userType is 0 then it is admin
        if(isUserExist.userType == 0){

            QUESTIONS.push({question , correctanswer})
            res.status(200).json({msg:"Question Added Succesfully"})

        }
        else{
            res.status(404).json({msg:"Not an Admin"})
        }

    }
    else{
        res.status(401).json({ msg: "Wrong Credentials" })
    }


})

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})
