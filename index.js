const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const { filterSubmission } = require('./filterSubmission')
const { initQUESTIONS } = require('./src/data/data')
const app = express()
const port = 3001
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use(express.static(path.join(__dirname,'/public/static/')))



app.set('views','src/views')
app.set('view engine','ejs')

const USERS = [];

const QUESTIONS = initQUESTIONS

const SUBMISSION = []

app.get('/',(req,res)=>{
  res.render('index',{msg:''})
})

app.get('/login',(req,res)=>{
  res.render('login',{msg:''})
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const {email, password, role} = req.body
  // body should have email and password
  if(!email || !password)
    res.status(400).send('Email or password cannot be blank')
  let userExists = USERS.some((user)=>{
    if(user.email === email)
    {
      res.status(409).render('login',{msg:'User already exists.'})
    }
  })
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email,password,role})
  // return back 200 status code to the client
  res.status(200).render('login',{msg:'User Registered Successfully'})
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email,password} = req.body
  // body should have email and password
  if(!email || !password)
    res.status(400).send('Email or password cannot be blank')
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user)=>{
    if(user.email===email){
      // Also ensure that the password is the same
      // If the password is not the same, return back 401 status code to the client
      if(user.password!==password)
        res.status(401).render('login',{msg:'Wrong Password. Please try again.'})
      else
      {
         // If the password is the same, return back 200 status code to the client
        // Also send back a token (any random string will do for now)
        const accessToken = `${user.role}/${user.email}`
        res.cookie('accessToken', accessToken, { secure: true, httpOnly: true });
        res.status(200).redirect('/questions')
      }
    }
  })
  res.status(404).render('index',{msg:'User does not exist in the database. Please Signup.'})
  })

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
    const role = req.cookies.accessToken.split('/')[0]
    if(req.cookies.accessToken)
      res.status(200).render('questions',{QUESTIONS,role:role})
    else
      res.redirect('/login')
})

app.get("/submissions/", function(req, res) {
  // return the users submissions for this problem
  const userId = req.cookies.accessToken.split('/')[1]
  if(userId)
  {
   //const result= filterSubmission(SUBMISSION,userId,'')
    let result =[]
   SUBMISSION.find((submission)=>{
    if(submission.userId=== userId)
   {
     result.push(submission) 
   }
   })
   res.status(200).render('submissions',{msg:'',submission:result, questionIndex: '',questionTitle:''})
  }
  else{
   res.redirect('/login')
  }
});

app.get("/submissions/:questionIndex/:questionTitle", function(req, res) {
   // return the users submissions for this problem
   const questionIndex = req.params.questionIndex
   const questionTitle = req.params.questionTitle
   const userId = req.cookies.accessToken.split('/')[1]
   if(userId)
   {
    const filteredResult= filterSubmission(SUBMISSION,userId,questionIndex)
    res.status(200).render('submissions',{msg:'',submission:filteredResult, questionIndex: questionIndex,questionTitle:questionTitle})
   
   }
   else{
    res.redirect('/login')
   }
});


app.post("/submissions/:questionIndex/:questionTitle", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const questionIndex = req.params.questionIndex
   const questionTitle = req.params.questionTitle
   const {solution} = req.body
   const userId = req.cookies.accessToken.split('/')[1]
   const solutionAccepted = Math.random()>0.5?'Accepted':'Rejected'
   const timeStamp = Date.now()
   // Store the submission in the SUBMISSION array above
   SUBMISSION.push({questionIndex,questionTitle,userId, solution, solutionAccepted, timeStamp })
    const filteredResult = filterSubmission(SUBMISSION, userId, questionIndex)
  res.status(201).render('submissions',{msg:'Your submission has been created!',submission:filteredResult, questionIndex: questionIndex,questionTitle:questionTitle})
});

app.get('/logout',(req,res)=>{
  res.cookie('accessToken', '', { secure: true, httpOnly: true });
  res.status(200).render('login',{msg:''})
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.get('/addQuestion',(req,res)=>{
  const role = req.cookies.accessToken.split('/')[0]
  if(role === 'admin')
    res.status(200).render('addQuestion',{role})
  else
    res.status(401).redirect('\logout')
})

app.post('/addQuestion',(req,res)=>{
  const role = req.cookies.accessToken.split('/')[0]
  const {title,description,input,output} = req.body
  const newQuestion = {
    title: title,
      description: description,
      testCases: [{
          input: input,
          output:output
      }]
  }
  QUESTIONS.push(newQuestion)
  res.status(201).render('questions',{QUESTIONS,role:role})
})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})