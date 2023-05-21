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

  const {email, password} = req.body ;

  if(!email || !password ){
    res.status(422).json({error : "please fill the required fields"});
  }

  const isPresent = USERS.find( element => element.email === email ) ;

  if(!isPresent){
    const data = {
      email , password
    }
    USERS.push(data)

  }

  res.status(200).json({message : "user sucessfully created"})
})

app.post('/login', function(req, res) {

  const {email , password } = req.body ;

  if(!email || !password){
    return res.status(422).json({error : "please fill the required fields"});
  }

  const emailIsPresent = USERS.findIndex(element => element.email === email )

  if(!emailIsPresent){
    return res.status(433).json({error : "invalid email or password"});
  }
  else {
    if(USERS[emailIsPresent].password !== password){
      return res.status(401).json({error : "invalid email or password"});
    }
    else{
      const token = "ddaskfjaskldfasfdafsj"
      return res.status(200).json({message : "logged In sucessfully" , token});
    }
  }
})

app.get('/questions', function(req, res) {

   res.json(200).json({questionBank : QUESTIONS});
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const {title} = req.body 
   const 
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})