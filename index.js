const express = require('express')
const app = express()
const port = 4500
app.use(express.json())


const USERS = [
  {
    email:"adm@gmail.com",
    password:"adm",
    type:"admin"
  },

  {
    email:"usr@gmail.com",
    password:"usr",
    type:"user"
  }

];

const QUESTIONS = [
  {
    Q_no:1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  Q_no:2,
  title: "sort It",
  description: "Given an array , sort it",
  testCases: [{
      input: "[4,5,2,1,3]",
      output: "[1,2,3,4,5]"
  }]

}
];


const SUBMISSIONS = [
  {
    user: "adm@gmail.com",
    Q_no: 1,
    code: "function two states }",
    status: "accepted"
  }

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password,type}=req.body;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(USERS.find(user => user.email === email) === undefined) {
    USERS.push({email: email, password: password, type: type})
    // return back 200 status code to the client
    res.status(200)
    res.send("User signup successful")
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password} = req.body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const loginUser = USERS.find(user => user.email === email);

  if (loginUser === undefined) {

    res.status(400)
    res.send("User does not exist")
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  else if (loginUser.password === password) {

    const token = Math.random().toString(36).substring(2,10)

    res.status(200)
    res.json({token: token})
  }
  // If the password is not the same, return back 401 status code to the client
  else {

    res.status(401)
    res.send("Incorrect password")
  }
})


app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const {user, question} = req.query

  const userSubmissions = SUBMISSIONS.filter(sub => ((sub.user === user) && (sub.Q_no.toString() === question)))


  res.status(200)
  res.json(userSubmissions)
})



app.post("/submissions", function(req, res) {
  if (QUESTIONS.find(q => q.Q_no === Q_no) === undefined) {

    res.status(400)
    res.send("Question does not exist")
  }

  else {

    const statusBool = (Math.random() < 0.5)
    const status = statusBool ? "accepted" : "rejected"


    SUBMISSIONS.push({user: user, Q_no: Q_no, code: code, status: status})

    res.status(200)
    res.send("Submission successfully added")
  }
 
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/questions", function(req, res) {

  const {email, title, description, testCases} = req.body

  const questionID = QUESTIONS.length + 1

  const thisUser = USERS.find(user => user.email === email)

  if (thisUser.type === "admin") {

    QUESTIONS.push({Q_no: Q_no, title: title, description: description, testCases: testCases})
    res.status(200)
    res.send("Question added")
  }

  else {

    res.status(401)
    res.send("Only admins can add a question")
  }
})


app.listen(port, function() {
  console.log(`leetcode listening on port ${port}`)
})