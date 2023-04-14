const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser'); //middeleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION =[];

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email=req.body.email;
  const password=req.body.password;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.some(user => user.email === email);
  if (userExists) {
    return res.status(400).send('User with this email already exists');
  }

  else{
    // If the user does not exist, add the new user to the USERS array
    USERS.push({ email, password });
    // Return a 201 Created status code to indicate that the user was successfully created
    return res.status(200).send('User created');
  }
  // return back 200 status code to the client
});

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    const email =req.body.email;
    const password=req.body.password;

  // Check if the user with the given email exists in the USERS array
    let userExists=False;
    let correctPassword=False;

    for(let i=0;i<USERS.length;i++){
      if(USERS[i].email===email){
        userExists=True;
        // Also ensure that the password is the same
        if(USERS[i].password===password){
          correctPassword=True;
          break;
        }
        break;
      }
    }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
    if(userExists && correctPassword){
      return res.status(200).send("random string token")
    }
     // If the password is not the same, return back 401 status code to the client
    if(userExists && !correctPassword){
      return res.sendStatus(401)
    }
    
});

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  return res.send(QUESTIONS);
});

app.get("/submissions", function(req, res) {
   const username=req.body.username;
   const problem_id=req.body.problem_id;
   // return the users submissions for this problem
   const userSubmissions = SUBMISSION.filter(sub => sub.name === username && sub.problem_id === problem_id);

   return res.send(userSubmissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const user_name=req.body.name;
   const solution=req.body.solution;
   const problem_id = req.body.problem_id;
   const accepted=Math.random()<0.5;

   if(accepted){
    const response="Solution Accepted";
   }
   else{
    const response="Solution Rejected";
   }
   // Store the submission in the SUBMISSION array above
  SUBMISSION.push({name,problem_id,solution,accepted});

  return res.send(response);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
//create a function to first check if they are admin or not and then if they are they can post problem using the add-questions route
//admin would posses a token with himself 
function isAdmin(req,res,next){

  const token = req.headers.authorization;
  // Check if the token is valid and corresponds to an admin user
  // Replace this with your own implementation of admin token verification
  const isAdminUser = verifyAdminToken(token);

  if (!isAdminUser) {
    return res.status(401).send('Unauthorized');
  }

  // If the user is an admin, call next() to allow the request to proceed
  next();
}

// ensure that only admins can do that.
app.post("/add-questions",isAdmin,function(req,res) {
  //added isAdmin to check for administrative permissions

  //taking in the problem
  const { title, description, testCases } = req.body;
  if (!title || !description || !testCases) {
    return res.status(400).send('Missing required fields');
  }

  //adding in the problem to questions list
  const problem = { title, description, testCases };
  QUESTIONS.push(problem)

  return res.status(201).send('Problem created');
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});