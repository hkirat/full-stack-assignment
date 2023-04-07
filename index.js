const express = require('express');
const uuid = require('uuid').v4
const app = express();
const jwt = require('jsonwebtoken')
const port = 3000

app.use(express.json())

const USERS = [];

const QUESTIONS = [{
  id: 'Q-' + uuid() ,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.post("/signup", function(req, res) {
  // Add logic to decode body
  // body should have email and password
  try {
    const {email, password} = req.body

    const userId = uuid()
    const roleChance = Math.random() * 10;
    let role = ''
    if (roleChance > 8) role = 'admin'
    else role = 'user'

    const emailExists = USERS.find(element => element.email === email)
    if (emailExists != undefined) return res.status(400).send({ status: false, message: 'Email Already Exists! ' })

    const user = { userId: userId, email: email, password: password, role: role }
  
    USERS.push(user)
    console.log(USERS);
    res.status(200).send({ status: true, message: 'User created Successfully! ', data: user,  })
  }
  catch (err) {
  res.status(500).send({status:false, message:err.message})    
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
})

app.post('/login', function (req, res) {
  

  try {
    const { email, password } = req.body
    
    if ((!email || !password)) return res.status(400).send({ status: false, message: "Email and password are mandatory" })
    
    const userExists = USERS.find(element => element.email === email)
    if (!userExists) return res.status(400).send({ status: false, message: 'User Does not exist' })
    if (!(userExists.password === password)) return res.status(401).send({ status: false, message: 'Either email or password is incorrect' })
    
    const token = jwt.sign({ userId: userExists.userId, role:userExists.role }, 'secret')
    
    res.status(200).send({status:true, message:'Logged In', token:token})

  }
  catch (err) {
    res.status(500).send({status:false, message:err.message})
  }
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  try {
    
    res.status(200).send({status:true, message:"All questions", questions:QUESTIONS})
    res.send("Hello World from route 3!")
  }
  catch (err) {
    res.status(500).send({status:false, message:err.message})
  }
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  try {
    res.status(200).send({status:true, submissions:SUBMISSION})
    
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
 
});

function mw(req, res, next) {
  try {
    const token = req.headers['token']
    if (!token) return res.status(401).send({ status: false, message: 'Token Must be Present' })
    
     jwt.verify(token, "secret", function (err, tokenVerify) {
       if (err) {
         return res
           .status(401)
           .send({ status: false, message: "Token is invalid or expired" });
       } else {
         req.token = tokenVerify;
         return next();
       }
     });
  }
  catch (err) {
        res.status(500).send({ status: false, message:err.message})

  }
  
}

app.post("/submissions",mw,  function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
  try {
    const { id, title, solution } = req.body
    console.log(req.token.userId)

    const idExits = QUESTIONS.find(elem => elem.id === id)
    
    if (!idExits) return res.status(400).send({ status: false, message: "This question doesnot exist" })
    
    if(idExits.title != title) return res
      .status(400)
      .send({ status: false, message: "The title should be same as original" });
    

    const submission = {
      id: id,
      title: title,
      solution: solution,
      userId: req.token.userId,
    };
    
    const accept = Math.random() 
    if (accept < 0.3) return res.status(400).send({ status: false, message: "Submission Not Accepted! Try Again" })

    SUBMISSION.push(submission)
    
    res.status(200).send({status:true, message:"Submission Accepted", totalSubmissions:SUBMISSION})
  }
  catch (err) {
    res.status(500).send({ status: false, message:err.message})
  }
  
   // Store the submission in the SUBMISSION array above
});

app.post('/questions', mw, function (req, res) {
  try {
    const { title, description, testCases } = req.body
    const { role, userId } = req.token

    if ((!testCases || !title || !description)) return res.status(400).send({ status: false, message: "testcases, title and description are mandatory! " }) 
    
    if (role == 'user') return res.status(403).send({ status: false, message: "Only Admins can post a question!" })
    
    const id = 'Q-' + uuid()
    const question = {id: id, title:title, description:description, testCases:testCases, userId:userId}
    QUESTIONS.push(question)
    res.status(200).send({status:false, message:"Question added", questions:QUESTIONS})

     
    
  }
  catch (err) {
     res.status(500).send({ status: false, message: err.message });
  }
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})