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

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client

  const { email,password } = req.body  
    if(USERS.includes(email)) {
        return res.status(400).json({message:'duplicate user'})
    }
    
    USERS = [...USERS,email]

    return res.status(200)



  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  const { email , password } = req.body

    if(USERS.includes(email) ) {
        res.json({token:"ABCD"}).status(200)
    }
    else {
        res.json({message:"unauthorised"}).status(401)
    }


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS).status(200)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.status(200).json(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { answer } = req.body

   const SUBMISSION = [...SUBMISSION,answer]

   res.status(200).json({message:"The answer has been posted"})
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})