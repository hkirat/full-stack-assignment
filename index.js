const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

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

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.send(`
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <a href="/signup"><button>Sign up</button></a>
      <a href="/login"><button>Login</button></a>
    </body>
  `)
})

app.get('/signup', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign Up</title>
    </head>
    <body>
      <form action="signup" method="POST">
        <input type="text" name="email" placeholder="Enter your mail id">
        <input type="text" name="password" placeholder="Enter your password">
        <input type="submit" value="submit">
      </form>
    </body>
  </html>`)
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body
  let flag = 0;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  for(let i = 0; i < USERS.length; i++)
  {
    if(email === USERS[i][0])
    {
      res.send(`Enter email is already signed up!!`);
      flag = 1;
      break;
    }
  }
  if(!flag)
    USERS.push([email, password]);
  // return back 200 status code to the client
  res.status(200).send(`process done`)
  
})

app.get('/login', function(req, res) {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login</title>
    </head>
    <body>
      <form action="login" method="POST">
        <input type="text" name="email" placeholder="Enter your mail id">
        <input type="text" name="password" placeholder="Enter your password">
        <input type="submit" value="submit">
      </form>
    </body>
  </html>`)
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body
  let flag = 0;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  for(let i = 0; i < USERS.length; i++)
  {
    if(email === USERS[i][0])
    {
      flag = 1;
      if(password === USERS[i][1])
        res.status(200).send(`login successful`);
      else
        res.status(401).send(`incorrect password`)
    }
  }

  if(!flag)
    res.status(401).send(`entered email does not exists`)

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
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