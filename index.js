const express = require('express')
const bodyParser = require('body-parser');
const { use } = require('express/lib/application');
const app = express()
const port = 3001

const USERS = [
  {email: "testemail1@example.com",password:"testpassword1", isAdmin: true},
  {email: "testemail2@example.com",password:"testpassword2", isAdmin: false},
  {email: "testemail3@example.com",password:"testpassword3", isAdmin: false},
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

]

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/signup', function(req, res) {
  
  const {email, password} = req.body
  if(!email || !password) {
    return res.status(400).send("missing email or password")
  }

  const existingUser = USERS.find((user) => {
    return user.email === email
  })
  if(existingUser) {
    return res.status(409).send("User Already exists")
  }

  USERS.push({email, password})

  return res.status(200).send('SignUp Successful')
})

app.post('/login', function(req, res) {

  const {email, password} = req.body
  if(!email || !password) {
    return res.status(400).send("missing email or password")
  }


  const existingUser = USERS.find((user) => {
    return user.email === email
  })

  if(!existingUser) {
    return res.status(404).send("user not found")
  }
  else if(existingUser && existingUser.password === password) {
    return res.status(200).send("logged in successfully")
  }
  else {
    return res.status(401).send("Wrong Password")
  }

})

app.get('/questions', function(req, res) {
  return res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
  const {email} = req.body

  const userSubmissions = SUBMISSION.filter(submission => {
    return submission.email === email
  })

  return res.status(200).send(userSubmissions)
});


app.post("/submissions", function(req, res) {
  const {email, submission} = req.body

  if(USERS.find(user => {return user.email === email})){
    SUBMISSION.push({email, ...submission})
    return res.status(200).send("Your solution was submitted")
  }

  return res.status(401).send("You are not loggedIn")

});


app.post("/question", function(req, res) {

  const {email, question} = req.body

  if(USERS.find(user => user.email === email && user.isAdmin) && question) {
    QUESTIONS.push(question)
    return res.status(200).send("Your question was submitted")
  }

  return res.status(500).send("Something went wrong!")
 
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
