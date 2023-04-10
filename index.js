const express= require('express')
const app=express()
const port = 3001

app.use(express.json())
const USERS=[]

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}]


const SUBMISSION = [

]


app.post('/signup', (req, res)=>{
    // Add logic to decode body
    // body should have email and password
    //check if user already exists
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    // return back 200 status code to the client

    if(USERS.find(user=>user.username == req.body.username)){

        return res.status(400).json({ error : 'User already exists'})

    }else{

    const user = {username: req.body.username, password: req.body.password}
    USERS.push(user)
    
    res.status(200).json({ message: 'User registered successfully'})

    }
})

app.post('/login', (req, res)=>{

    // Add logic to decode body
    // body should have email and password

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client

    const user = USERS.find(user => user.username == req.body.username)
  if(!user){
    return res.status(401).json({error: 'Invalid user_name'})
  }
  //check password
  if(user.password !== req.body.password){
    return res.status(401).json({error: 'Invalid password'})
  }
  //send success message
  res.json({ message: 'Login successful' });
})

app.get('/questions', (req, res)=>{
    //return the user all the questions in the QUESTIONS array
    
    res.json(QUESTIONS)
})

app.get("/submissions", (req, res)=>{
    res.json(SUBMISSION)
})

app.post("/submissions", (req, res)=>{
    // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   
   const question = {title: req.body.title , description: req.body.description, 
    testCases: req.body.testCases}
    
    if((Math.random()*100) > 10){
        SUBMISSION.push(question)
        res.json({message: 'Submission accepted'})
        
        
    }else{
    res.json({message: 'Submission rejected' })
    }
    
})
app.listen(port, function() {
    console.log(`Example app listening on port ${port}`)
  })
  
