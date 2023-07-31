//some Change
const express = require('express')

const app = express()
const port = 8080
app.use(express.json()) 

const  ADMINS = ['sameer@gamil.com']

const USERS = [{
  email: 'sameer@gmail.com',
  name : 'sam',
  pass : 'abcd'
}];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  title: "Fibbonacci numbers",
  description: "Given an array ,check weather fibnnoci or not?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "False"
  }]
},
{
  title: "Pivot Element",
  description: "Given an array , return the pivot element?",
  testCases: [{
      input: "[1,2,5,4,3]",
      output: "5"
  }]
},
{
  title: "Sub String ",
  description: "Given an String , return all the possible subStrings?",
  testCases: [{
      input: "sam",
      output: "[ 's', 'a','m', 'sa', 'am','sam' ]"
  }]
}
];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  console.log(req.query);
  console.log(req.body);
  let present = false;
  USERS.forEach( (user)=>{
    if(user.email==req.body.email){
      present = true;
    }
  })
  if(!present){
    USERS.push({
      email: req.body.email,
      name : req.body.name,
      pass : req.body.password
    })
    res.sendStatus(200);
  }else{
    res.sendStatus(402);
  }
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  
})

app.post('/addquestions', (req, res)=>{
  let email = req.body.email;
  let auth = false;
  ADMINS.forEach( (admin)=>{
    if(admin == email){
      auth= true;
    }
  });
  if(!auth){
    res.sendStatus(401);
  }else{
    QUESTIONS.push({
      title: req.body.title,
      description: req.body.description,
      testCases: req.body.testCases
    })
    res.send("question added sucessfully");
  }
});

app.post('/login', function(req, res) {

  let present = false;
  USERS.forEach( (user)=>{
    if(user.email==req.body.email){
      if(user.pass == req.body.password)
        present = true;
    }
  })
  if(present){
    res.statusCode = 200;
    res.send('randomStringHereDontMind');

  }else{
    res.sendStatus(401);
  }
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   let submission = req.body.code;
   if(submission.length >50){
    SUBMISSION.push(submission);
    res.send("ACCEPTED!")
   }
  res.send("REJECTED!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})