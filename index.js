const express = require('express')
const app = express()
const port = 3001
app.use(express.json());
class User{
 constructor(email,password,isAdmin){
  this.email = email;
  this.password = password;
  this.isAdmin = isAdmin;
 }
}

class Submission{
  constructor(code){
    this.code = code;
  }
}

class Question{
  constructor(title,description,testCases){
        this.title = title;
        this.description = description;
        this.testCases = testCases;
  }
}

class Testcase{
  constructor(input,output){
      this.input = input;
      this.output = output;
  }
}

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
  // Add logic to decode body
  // body should have email and password
  const {email,password,isAdmin } = req.body;
    let present = false;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
      for(let i = 0;i<USERS.length;i++){
           if(USERS[i].email === email){
            present = true
            res.send('username has already taken!')
           }
      }
    
    
    if(!present){
      const user1 = new User(email,password,isAdmin);
      USERS.push(user1);
      console.log(user1);
      res.statusCode = 200;
      res.send('Success..')
    }

  // return back 200 status code to the client
 
})

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex % charactersLength);
  }
  return result;
}

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;
  let authenticated = false;
  res.setHeader('Content-Type','application/json');
  let token1 = generateRandomString(20);
  const data = {
    token:token1
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  
      for(let i = 0;i<USERS.length;i++){
        if(email === USERS[i].email && password === USERS[i].password){
          authenticated = true;
          res.statusCode = 200;
          res.send(JSON.stringify(data));
        }
      }

      if(!authenticated){
        res.statusCode = 401
        res.send(' you are not authenticated!')
      }
    


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.statusCode = 200;
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.statusCode = 200;
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const {submission} = req.body;
   let num = Math.floor(Math.random() * 10);
   if(num>5){
    const sub = new Submission(submission);
      SUBMISSION.push(sub);
   }
  res.send(SUBMISSION);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addQuestion",function(req,res){
  email = req.headers.email;
 const question = req.body;
 let isAdmin = false;
  for(let i = 0;i<USERS.length;i++){
    if(USERS[i].email === email){
        isAdmin = USERS[i].isAdmin;     
    }
  }
  if(isAdmin){
    QUESTIONS.push(question);
  }
  res.send(QUESTIONS);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})