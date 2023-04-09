const express = require('express')
const app = express()
const port = 3001
const jwt = require('jsonwebtoken');
app.use(express.json())


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


function autharization(req,res,next){


  const authHeader=req.header.authorization
  const token =authHeader && authHeader.split(' ')[1]

  if(!token){

    return res.sendStatus(401)
  }
jwt.verify(token,"hello",(err,decoded)=>{
if(err){
  return res.sendStatus(401)
}

req.username=decoded.username
next()
})

}


app.post('/signup', async (req, res)=> {

  const {email,password,username}=req.body
  const check = await USERS.find((user)=>user.email==email)
  if(check){
    return res.status(400).json({message:"USER ALDREADY THERE"})
  }
    USERS.push({email,password,username})
    return res.status(200).json({message:"SIGNUP SUCESSFUL"})
})

app.post('/login', async (req, res)=> {


  const {email,password,username}=req.body


  const check =USERS.find((users)=>(users.email==email))
  const check_username =USERS.find((users)=>(users.username==username))
   
  if(!check || !check_username){
    return res.send(401).json({message:"please SIGNUP!! "})
  }

  const passwordcheck= password==check.password
  const usernamecheck= username==check.username

  if(!passwordcheck && usernamecheck){

    return res.send(401).json({message:"wrong username or password"})
  }


  const token = jwt.sign({ id: check.username }, "hello", { expiresIn: '5d' });

  res.cookie('token', token, { httpOnly: true });
  res.send(200).json({ success: true });

})

app.get('/questions',autharization, function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions",autharization, function(req, res) {
   // return the users submissions for this problem
   res.json(SUBMISSION)
});


app.post("/submissions",autharization, function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  SUBMISSION.push(req.submissions)
   res.send(200).json({message:"you have sucessfuly made a submission"})
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})