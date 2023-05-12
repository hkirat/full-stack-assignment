
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
app.get('/', (req, res)=>{
    app.send('<html><body><h1>Welcome to my Assignment</h1></body></html>')
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
   const {email, password} = req.body
    if(!email || !password){
        res.send('PLEASE ENTER YOUR DETAILS IN THE FIELDS')
    }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const myuser = {
        email,
        password
    }
    const userExists = USERS.some(user => user.email == myuser.email)
  // return back 200 status code to the client
  if(userExists){
    res.send('USER EXISTS')
  }else {
    res.status(200).send('THANK YOU FOR SIGNING UP')
    USERS.push(myuser)
  }
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    const {email, password} = req.body
    const myuser = {
        email,
        password
    }
    
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let userExists = USERS.some(user => user.email == myuser.email)
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (userExists || USERS.some(user => user.password == myuser.password)){
    res.status(200).send('WELCOME BACK BEETCODE')
}else {
    res.status(401).send("PLEASE TYPE IN THE CORRECT EMAIL AND PASSWORD")
}
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
    const userid = req.query.userid
    const probid = req.query.probid
     // return the users submissions for this problem
  
    const submissions = SUBMISSION.filter(submission =>  {
      if (probid) {
        return submission.userid === userid && submission.probid === probid
      } else {
        return submission.userid === userid
      }
    })
  
    res.send(submissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const sol = req.body
   SUBMISSION.push(sol)
    let endPrompt = MATH.random() > 0.5 ? 'accepted': 'rejected'
    res.send(`your response has been ${endPrompt}`)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
