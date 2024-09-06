import express from "express"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import 'dotenv/config'


const app = express()

const port = process.env.PORT||3001

const saltRound = 10;

const SECRET_KEY = 'Type_here_For_Key';

app.use(express.json())
app.use(cookieParser())

const USERS = [
  //example
  // {
  //   email : "ishaan@gmail.com",
  //   password : "123345678",
  //   admin : true
  // }
];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  // example
  // {
  //   QuestionTitle:"Two states",
  //   code:"#include<bits/stdc++.h> \n int main(){\n return 0; \n}",
  //   success: true
  // }
]

app.post('/signup', async(req, res)=>{
  // Add logic to decode body
  const body = req.body
  // body should have email and password
  if(!(body.email && body.password)){
    return res.status(404).json({error:"email or password is not given"})
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const findUser = USERS.find(u=>u.email === body.email)
  if (findUser) {
    return res.status(409).json({error:"email already exist"})
  }
  try{
  const hashedPassword = await bcrypt.hash(body.password,saltRound)
  const newUser = {
    email:body.email,
    password:hashedPassword,
    admin:body.admin === undefined ? false : body.admin
  }
  USERS.push(newUser)
  // return back 200 status code to the client
  res.status(200).json({message:`User ${body.email} added to Database`})
  }catch(err){
    res.status(500).json({error:"Error while processing your Password"})
  }
})

app.get('/users',(req,res)=>{
  res.json(USERS)
})

app.post('/login', async(req, res)=>{
  // Add logic to decode body
  const body = req.body
  // body should have email and password
  if (!(body.email && body.password)) {
    return res.status(404).json({error:"no email or password found"})
  }
  // Check if the user with the given email exists in the USERS array
  const findUser =  USERS.find(u=>u.email === body.email)
  if (!findUser) {
    return res.status(404).json({error:"email not found"})
  }
  // Also ensure that the password is the same

  try {
    const match = await bcrypt.compare(body.password,findUser.password)
    if (!match) {
      return res.status(401).json({error:"Error password do not match"})
    }
    const token = jwt.sign({email:body.email},SECRET_KEY,{expiresIn:'1h'})
    res.cookie('token',token,{
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      maxAge:3600000
    })
    res.status(200).json({token,message:"logged in"})
  } catch (err) {
    return res.status(500).json({error:"Error while Processing login"})
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  
})

app.get('/questions', (req, res)=>{
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", (req, res)=>{
   // return the users submissions for this problem
  res.status(200).json(SUBMISSION)
});


app.post("/submissions", (req, res)=>{
   // let the user submit a problem, randomly accept or reject the solution
  const body = req.body
  if (!body) {
    return res.status(404).json({error:"Not able to get submission"})
  }
  if(!(body.QuestionTitle)){
    return res.status(404).json({error:"not able to find questions"})
  }
  const correct = Math.random() > 0.5 

  const storeSubmission ={
    QuestionTitle:body.QuestionTitle,
    code:body.code,
    success:correct
  }
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(storeSubmission)
  res.status(200).json(storeSubmission)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const verifyToken = (req,res,next)=>{
  const token = req.cookies.token  
  if(!token){
    return res.status(404).json({error:"Error for Authentication Token"})
  }
  const decoded = jwt.verify(token,SECRET_KEY)
  const user = USERS.find(u=>u.email === decoded.email)
  req.user = user
  next();
}

app.post('/addproblem',verifyToken,(req,res)=>{
  const user = req.user  
  if (!user.admin) {
    return res.status(409).json({error:"You are not allowed to add"}) 
  }
  const body = req.body
  if (!(body && body.title && body.description && body.testCases)) {
    return res.status(404).json({error:"Please Fill all the entries"})
  }
    const newQuestion = {
    title: body.title,
    description: body.description,
    testCases: body.testCases}
  QUESTIONS.push(newQuestion)
  res.status(201).json(newQuestion)
})

app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`)
})