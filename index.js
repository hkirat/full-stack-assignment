const express = require('express')
const app = express()
const port = 3001

const bodyparser = require('body-parser')
app.use(bodyparser.json());

const USERS = [
{
  name: "user",
  email: "user@gmail.com",
  role: 0,
  password: "user",
},
{
  name: "admin",
  email: "admin@gmail.com",
  role: 1,
  password: "admin",
}
];
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
      {
    title: "Minimum of an array",
    description: "Given an array , return the minimum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "1"
    }]
  },
];


const SUBMISSION = [
  {
    question:"Two states",
    solution:"function twoStates(arr){return Math.max(...arr)}",
    isCorrect:true
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password,isAdmin} = req.body;

  if(!email || !password){
    res.status(400).send("Email or password is missing");
    return;
  }
  const role = isAdmin?1:0;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const existingUser = USERS.find(user => user.email === email);

  if(existingUser){
    res.status(400).send("User already exists");
    return;
  }

  USERS.push({email,password,role});

  // return back 200 status code to the client
  res.status(200).send('User created successfully')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and 
  const {email,password} = req.body;

  if(!email || !password){
    res.status(400).send("Email or password is missing");
    return;
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const existingUser = USERS.find(user => user.email === email);

  if(!existingUser){
    res.status(401).send("User does not exist");
    return;
  }
  if(existingUser.password !== password){
    res.status(401).send("Password is incorrect");
    return;
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token = Math.random().toString(36).substring(5);

  res.status(200).json({message:'User logged in successfully',token})
  
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json({message:'Success',questions:QUESTIONS})
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const {question} = req.body

  if(!question){
    res.status(400).send("Question is missing");
    return;
  }

  //Assuming all the question titles will be unique
  const submissions = SUBMISSION.filter(sub => sub.question == question);

  if(!submissions){
    res.status(400).send("No submissions found for this question")
    return;
  }

  res.status(200).json({message:'Success',submissions})
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const {question,solution} = req.body

  if(!question || !solution){
    res.status(400).send("Question or solution is missing");
    return;
  }

  const isCorrect = Math.random() > 0.5;
  SUBMISSION.push({question,solution,isCorrect});
  res.status(200).json({message:`Solutions is ${isCorrect}`})
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

const isAdminCheck = (req,res,next) => {
  const {email,password} = req.body;

  if(!email || !password){
    res.status(400).send("Email or password is missing");
    return;
  }

  const existingUser = USERS.find(user => user.email === email && user.password === password);

  if(!existingUser){
    res.status(401).send("User does not exist");
    return;
  }

  if(existingUser.role == 0){
    res.status(401).send("User is not an admin");
    return;
  }

  next();
}

app.post("/questions",isAdminCheck, (req, res)=>{
  const {title,description,testCases} = req.body;

  if(!title || !description || !testCases){
    res.status(400).send("Title, description or test cases are missing");
    return;
  }

  QUESTIONS.push({title,description,testCases});
  res.status(200).json({message:'Question added successfully'})

})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})