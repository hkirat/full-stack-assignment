const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001
const path=require('path')
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
console.log("okay")
app.get('/signup', function(req, res) {
  res.sendFile(__dirname + "/form.html")
});

app.post('/signup-submit', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client

    const user = req.body;
    var bool = false
    const use = USERS.find(element => {
      if (element.email === user.email) {
        bool=true
        return bool
      }
        return bool
    })
    if (bool===false){
      USERS.push(user)
      res.send("user created")
      res.sendStatus(200)
    } else{
      res.send(USERS)
      res.sendStatus(200)
    }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Hello World from route 2!')
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
});

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Heljhhhhhlo World from routjbe 4!")
});
app.get("/", function(req, res) {
  // return the users submissions for this problem
 res.send(`<html><head><style>.server {max-width:50px;}</style></head><body><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Servers_at_LAAS_%28FDLS_2007%29_0392c.jpg/330px-Servers_at_LAAS_%28FDLS_2007%29_0392c.jpg" class="server"/><p>${__dirname}</p><button></body></html>`)
 res.send(console.log(__dirname))
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World frfffom route 4!")
  console.log("succ on that hiiiii")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})