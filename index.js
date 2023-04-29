const express = require('express')
const app = express();
const { v4: uuidv4 } = require('uuid');;
const port = 3001

let USER = null;
const USERS = [{
  username:"Roger",
  email: "rg23@gmail.com",
  password:"1234",
  isAdmin: true
},
{
  username:"Sunny",
  email: "sg23@gmail.com",
  password:"1234",
  isAdmin: false
},
{
  username:"Sachin",
  email: "st23@gmail.com",
  password:"1234",
  isAdmin: false
},
{
  username:"Ranveer",
  email: "rs23@gmail.com",
  password:"1234",
  isAdmin: false
},
];


const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  {
    problem: "Two states",
    testcases: 45,
    passed: 30,
    result: "rejected",
    username: "rg23@gmail.com"
  },
  {
    problem: "Two states",
    testcases: 45,
    passed: 40,
    result: "rejected",
    username: "rg23@gmail.com"
  },
  {
    problem: "Two sum",
    testcases: 55,
    passed: 50,
    result: "rejected",
    username: "sg23@gmail.com"
  },
  {
    problem: "Next Greater Element",
    testcases: 60,
    passed: 60,
    result: "accepted",
    username: "rs23@gmail.com"
  }
]

// find user with the email
const checkEmail = (email)=>{
 for(let i = 0;i < USERS.length;i++)
 {
    if(USERS[i].email === email)
    {
      return true;
    }
 }
 return false;
}

// check if user email and password exists
const checkCredentials = (email,password) =>{
  console.log(email + " " + password);
 for(let i = 0;i < USERS.length;i++)
 {
      if(USERS[i].email === email && USERS[i].password === password)
      return USERS[i];
 }
  return null;
}


const checkUserLoggedInOrNot = (req,res,next)=>{
   if(USER === null)
   {
    res.json({message:"Log in, First!"}).status(401);
   }
   else
   {
     next();
   }
}
// for parsing the form data that we might get from the frontend (login, signup)
app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));



app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const user = req.body;


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(!checkEmail(user.email))
  {
    USERS.push(user);
    USER = user;
    USER["isAdmin"] = false;
    res.json({message:`Hi, ${user.username}. you are signed up!!!`}).status(200);
  }
  else
  {
    res.json({message:`Hi, ${user.username}. you are already registered!!!`}).status(401);
  }

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
     const user = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

    const matchingUser = checkCredentials(user.email,user.password);
     if(matchingUser)
     {
      USER = matchingUser;
      res.json({authToken: `${uuidv4()}`}).status(200);
     }
     else
     {
     
      res.json({message: "Wrong credentials"}).status(401);
     }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  
  res.json({questions: QUESTIONS}).status(200);
})

app.get("/submissions", checkUserLoggedInOrNot,function(req, res) {
   // return the users submissions for this problem
   const problem = req.query.problem;
   const submissions = SUBMISSION.filter((submission)=> {
     return submission.problem === problem && submission.username === USER.email;
   })
  res.json({userSubmissions: submissions}).status(200);
});


app.post("/submissions", checkUserLoggedInOrNot,function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
    const problemSubmission = req.body;
    problemSubmission["username"] = USER.email;
    SUBMISSION.push(problemSubmission);
    console.log(SUBMISSION);
    res.json({message: "Submitted!!!"}).status(401);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/addProblem',checkUserLoggedInOrNot,(req,res)=>{
  const question = req.body;
  
   if(USER.isAdmin === true)
   {
     QUESTIONS.push(question);
     res.json({message:"Added a problem"}).status(200);
   }
   else
   {
     res.json({message: "You are not an admin"}).status(400);
   }
})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})