
const express = require('express')
const next = require('next')

const bodyParser = require('body-parser')
// const { default: handler } = require('@/pages/api/hello')
const dev = process.env.NODE_ENV !== 'production'
const port = 3000


const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {

    const server = express()

    server.use(bodyParser.json())

    const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

function passHandler(req, res) {

  

  if(req.method === 'POST'){
      

      const {email, pass} = req.body

      usrExistCrPass = USERS.some(
        (usr) => usr['id'] === email && usr['pass'] === pass
      )

      usrExistIcPass = USERS.some(
        (usr) => usr['id'] === email && usr['pass' !== pass]
      )

      if(usrExistCrPass) {
        res.status(200).send("Welcome Back! Member")
      }

      

      else if(usrExistIcPass) {
        res.status(400).send("Hey existing user, please check the password and try again")
      }

      else {
        USERS.push({'id':email, 'pass':pass})
        res.status(200).send("User successfully created")
      }
      


  }


}

const SUBMISSION = [

]

server.get('*', (req, res) => {
   return handle(req, res);
})
  




server.post('/signUp', (req, res) => {
  passHandler(req, res);
})

  


server.post('/login', (req, res) => {

  passHandler(req, res);
})

server.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

server.get("/submissions", function(req, res) {

  const qtn = req.query


   // return the users submissions for this problem
  res.send(SUBMISSION.filter((sub) => sub.qtn === qtn))
});


server.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

   const {qtnId, usrId, sol } = req.body

   if((qtnId)&&(usrId)&&(sol)){
    SUBMISSION.push({qtnId, usrId, sol })
    res.status(200).send("Successfully Submitted")
   }
   else{
    res.status(400).send("Please check the fields, might be empty")
   }
  
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.


server.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
})