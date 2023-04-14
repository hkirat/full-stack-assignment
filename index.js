const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001
app.use(express.static('public'));
const tokens=[]
let user = {}
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
// const mime = require('mime');

// app.use(express.static(__dirname + '/public', {
//   setHeaders: function(res, path) {
//     res.setHeader('Content-Type', mime.getType(path));
//   }
// }));


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

app.post('/signup/submit', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client

    user = req.body;
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
      res.send(`<html><body><p>user created</p><br><br><a href="http://localhost:3001/login">Log In</a></body></html>`);
      res.sendStatus(200)
    } else{
      res.send(USERS)
      res.sendStatus(200)
    }
})
app.get('/login', function(req, res) {
  res.sendFile(__dirname + "/login.html")
});
app.post('/login/submit', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const user = req.body;
  const use = USERS.find(element => {
    if (element.email === user.email) {
      if (element.password === user.password){
        const token = generateString(5)
        tokens.push({"user":user.email,
         "token" :token})
        res.send(`<html><body><h1>Logged In!</h1><br><p>The token is:- ${token}</p><br><a href="http://localhost:3001/${token}/questions">Questions</a></body></html>`)
        res.sendStatus(200)
      }else{
        res.send("Incorrect Password!")
        res.sendStatus(401)
      }}
})
      res.send("User does not exist!")

})
;

app.get('/:token/questions', function(req, res) {
  const token = req.params.token;
  // Do something with the userId
  let check = 0
  for (let i=0; i<tokens.length; i++){
    if (tokens[i].token === token){
      if (tokens[i].user === user.email){
        check = 1;
        // res.send(`<html><body><h1>${QUESTIONS[0].title}<br><h3>${QUESTIONS[0].description}</h3></body></html>`)
        break;}
      else{
        check=2;
        // res.send(tokens[i])
        break;
      }}else{
        // res.send(`<html><body><p>${user.email}</p><p>${JSON.stringify(tokens[i].user)}</p></body></p></body></html>`)
        continue;}}
  if (check === 0){
    res.send("hacker")
  }else if (check===1){
    res.send(`<html><body><h1>${QUESTIONS[0].title}<br><h3>${QUESTIONS[0].description}</h3></body></html>`)
  }else {
    res.send("user-token mismatch")
  }
  // if (tokens.token.includes(token)){
  // res.send(`<html><body><h1>${QUESTIONS[0].title}<br><h3>${QUESTIONS[0].description}</h3></body></html>`)}
  // else{
  //   res.status(404).send(tokens);
  // }
  // res.send(tokens)
});

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(tokens)
});
app.get("/", function(req, res) {
  // return the users submissions for this problem
 res.send(`<html><head><a href="http://localhost:3001/login">Log In</a><br><a href="http://localhost:3001/signup">Sign Up</a></body></html>`)
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