const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = 'mySecretKey';
const crypto = require('crypto');
const app = express()
const port = 3001
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
const USERS = [
    {
        email: "desmondaditya@gmail.com",
        password : "12345",
        admin : true 
    },
    {
        email : "hello@gmail.com",
        password : "password",
        admin : false 
    }
];

const QUESTIONS = [
    {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
    title:"Ttemp",
    description:"just for checking purpose?",
    testCases:[
        {
            input: "[1,2,3,4,5]",
            output:"69"
        }
    ]
}
];


const SUBMISSION = [

]

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/frontend/index.html');
})

app.get ('/signup' , (req,res)=> {
  res.sendFile(__dirname + '/frontend/signup.html');
})

app.post('/signup', function(req, res) {
  let freshUsername = req.body.email;
  let freshPassword = req.body.password1;
  //sorry i write crappy js forgive me i am c coder shifting to js
  let newUser = true ;
  for(let i=0;i<USERS.length;i++){
    if(freshUsername === USERS[i].email){
      newUser === false ;
      // aah i used === to assign stuff imagineeeee aaaaaaaaaaaaaaah
    }
  } 
  /* 
 this is .some() which basically returns true / false if one of the elements satisfies the condition 
 if( USERS.some(el => el.email === freshUsername) ){
 res.status(401).send('You exist); 
}
  */
  if(newUser){
    let tempUser = {
      email : freshUsername ,
      password : freshPassword ,
      admin: false
    }
    /* Better way to Push something in array is 
    USERS.push({email,password});
    USERS array is gonne look like-
    [  { email: 'john@example.com', password: 'password1' },  { email: 'jane@example.com', password: 'password2' },  { email: 'alice@example.com', password: 'password3' }]
    */
  USERS.push(tempUser);
   res.status(200)
  res.send(`You are created :dwight  + <a href="/login">click here to login</a>`) 
  }
  else {
    res.status(401)
    res.send(`You Exist + <a href="/login">click here to login</a>`)
  }
})

app.get('/login' , (req,res) => {
  res.sendFile(__dirname + '/frontend/login.html')
})

const hashPassword = (pass) => {
  const hash = crypto.createHash('sha256');
  hash.update(pass);
  return hash.digest('hex');
}
app.post('/login', (req, res) => {
  let username = req.body.username ;
  let password = req.body.password;
  let userExist = false ;
  let index ;
  for(let i=0;i<USERS.length;i++)
  {
    if(USERS[i].email === username){
      index = i ;
      userExist = true ;
    }
  }
  /* Another better way to find something in array is using .find()
  it is call back function 
  USERS.find( (el) => el.email === username )
  it will return something like this {username : adjfhja , password : wiesgkj}
  if it does not find some thing it will return undefined
   */
  if(userExist){
    if(USERS[index].password === password){
      res.status(200)
      const string1 = `:dwight smirk`;
      const token = hashPassword(string1);
      res.send(token)
    }
    else {
        res.status(401)
        const string2 = `Why you prank me`
        res.send(string2)
    }
  }
  else {
    res.status(401)
    const string3 =  `<html>
      <head>
	    <title>Why you dont signup ?</title>
      </head>
      <body>
      <h4>M'lady you havent signedup yet</h4><br>
      <a href="/signup"><button>Signup</button> </a>
      </body>
      </html>`
    res.send(
    string3 
    )
  }
  
})

app.get('/questions', function(req, res) {
    let tempQuestions = '' ;
    for(let i=0;i<QUESTIONS.length;i++)
    {
        tempQuestions += `${QUESTIONS[i].description} <br>`
    }
  res.send(tempQuestions)
})

app.get("/submissions", function(req, res) {
  res.status(200).send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
    let userSubmission = req.body.submisson ;
    const accepted = Math.random() < 0.5
    SUBMISSION.push(userSubmission,accepted);
    if(accepted ){
      res.status(200).send('accepted ur solution');
    }
    else {
      res.status(401).send('rejected ur solution');
    }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})