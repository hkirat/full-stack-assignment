const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3001

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const USERS = [];

const QUESTIONS = [{
    question_id: 1, //adding this for ease of access
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

  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password)
  {
    //this should be done in frontend, but doing here for now
    res.json({"error": "Email or password is missing"});
  }

  let userExists = false;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.forEach((user) => {
    if(user.email === email)
    {
      userExists = true;
    }
  })

  if(userExists)
  {
      res.status(409).json({"error": "User already exists"});
  }
  else{
    USERS.push({email, password});
    res.json(USERS);
  }

  // return back 200 status code to the client
  // res.status(200).json({email, password});
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password)
  {
    //this should be done in frontend, but doing here for now
    res.json({"error": "Email or password is missing"});
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let userExists = false;
  let this_user = {};

  USERS.forEach((user) => {
    if(user.email === email)
    {
      userExists = true;
      this_user = user;
    }
  })

  // If the password is the same, return back 200 status code to the client
  if(userExists)
  {
    if(this_user.password === password)
    {
      // Also send back a token (any random string will do for now)
      res.status(200).json({"message":"Login successfull"});
    }
    // If the password is not the same, return back 401 status code to the client
    else{
      res.status(401).json({"error": "incorrect password"})
    }
  }
  else{
    res.status(401).json({"error": "User does not exists"})
  }

  res.send('Hello World from route 2!')
})


app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
 
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const question_id = req.body.question_id;
   const user_id = req.body.user_id;

    let subs = [];
   SUBMISSION.forEach((sub) => {
    if(sub.question_id === question_id && sub.user_id === user_id){
      subs.push(sub);
    }
   })

   res.status(200).json(subs);

});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   
   //assuming the user is logged in, which means have token
   let this_question = {};
   let question_id = req.body.question_id;
   const response = {
     question_id: question_id,
     user_id: req.body.user_id, //will get from token, for now using from body
     answer: req.body.answer
    }
    
    QUESTIONS.forEach((que) => {
      if(que.question_id == question_id){
        this_question = que;
      }
    })

    // Store the submission in the SUBMISSION array above
    SUBMISSION.push(response);
    console.log(SUBMISSION);

    if(response.answer === this_question.answer)
    {
      res.status(200).json({"response": "Correct"});  
    }
    else{
      res.status(200).json({"response": "inCorrect"})
    }
    


});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/question", (req, res) => {

})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})