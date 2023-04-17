const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const app = express()
const port = 3000

const USERS = [
];

const SUBMISSION = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
  }]
}];

// Helper functions for hashing / comparing password and generating / decoding token
// Hash a password using bcrypt
async function hashPassword(password) {
  try{
    const hash = await bcrypt.hash(password);
    return hash;
  }
  catch (err) {
    console.log(err)
  }
}

// Compare a password with a hash using bcrypt
async function comparePasswords(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate JSWON token
const generateToken = (email) => {
  try {
    const token = jwt.sign({ data: email }, process.env.SECRET)
    return token
  } catch (err) { console.log(err) }
}

// Decode Token
const decodeToken = (token) => {
  try {
    const decode = jwt.verify(token, process.env.SECRET)
    return decode
  } catch (err) { console.log(err) }
}

app.post('/signup', (req, res) => {
  const {email, password } = req.body

  // Checking if user with the entered email already exists
  if(USERS.find(user => user.email === email)){
    res.status(409).send("User with this email already exists, try login")
  }
  else{
    USERS.push({email, password})
  }
})

app.post('/login', (req, res) => {
 // Checking if user with the entered email doesn't exists
 const user = USERS.find(user => user.email === email)
 
 if (!user || !(bcrypt.compare(password, user.password))) {
  return res.status(401).send("Invalid credentials");
 }
 else {
  res.status(200).json({ token })
 }

})

app.get('/questions', (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})


app.post("/submissions", (req, res) => {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const {problem, solution} = req.body

  //  randomly genarating boolean
   const randomBoolean = Math.random < 0.5
 
   SUBMISSION.push({problem, solution, randomBoolean})
 
   if (randomBoolean){
     res.status(200).send("Submission Accepted")
   }else{
     res.status(403).send("Submission Rejected")
   }
 });

app.post("/admin/addproblem", (req, res) => {
  // Create a route that lets 'only' an admin add a new problem

  // This can be done in two ways:
  // #1 -> logic that admin's id will contain string 'admin' in it
  //  #2 -> by assigning 'role' to the admin's credentials in USER[]
  
  // Implimenting #1, it'll work fine for now
  if(!req.USERS || !req.USERS.username || !req.USERS.username.includes('admin')) {
    return res.status(401).send('Access denied. You are not authorized to access this resource.')
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})