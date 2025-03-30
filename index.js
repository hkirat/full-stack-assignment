const express = require("express")
const app = express()
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))
const port = 3001

var  USERS = [
  {
    email : "akhilrdy27@gmail.com",
    password : "akhil@121"
  },
  {
    email : "abcd@gmail.com",
    password : "asdfghjkl;"
  }
];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  title : "postive and negative subarry",
  description : "given an array return no of postive subarrays and negative subarrays",
  testCases :[{
    input : "[1,2,3]",
    output : "[6,0]"
    }]
}];


const SUBMISSION = [

]



app.get('/', (req,res)=>{
  res.send("hello welcome")
});


app.get('/signup', (req,res)=>{
      // res.send("<h1>signup</h1>")
      res.sendFile(__dirname + "/signup.html");
})



app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  var email = req.body.email;
  var password = req.body.password
  // var {email,password} = req.body
  // checking if user exists
  const userExists = USERS.find(user=>user.email === email);
  if(userExists){
    return res.status(409).send("user already exists");
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    USERS.push({email,password});
      res.status(200).send("successfully user created");
    console.log(USERS);
  // return back 200 status code to the client
  //res.send('Hello World!')
  
})


app.get('/login',(req,res)=>{
  res.sendFile(__dirname + '/login.html');
})


app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  var email = req.body.email;
  var password = req.body.password;
// Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userExists = USERS.find(user=>user.email === email);
  if(userExists){
    const corPswd = USERS.find(u=>u.password === password);
    if(corPswd){
      res.status(200).send("welcome back " );
    }else{
      res.status(401).send("wrong password");
      
    }
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  //res.send('Hello World from route 2!')
})



app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  //res.send(QUESTIONS); this is sending in json and looks very ugly
  let html = '<h1>Questions</h1>';
  html += '<ol>';
  QUESTIONS.forEach(question => {
    html += `<li>${question.title}</li>`;
    html += '<ul>'
    html += `<li>${question.description}</li>`;
    html += '</ul>';
  });
  html += '</ol>';
  res.send(html);
  
})




app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   var submission = req.body;
   const isSub = Math.random()>0.5?true:false;
   if(isSub){
    SUBMISSION.push(submission);
    return res.status(200).send("submission accepted");
   }else{
    return res.status(200).send("submission not accepted");
   }
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.




app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})