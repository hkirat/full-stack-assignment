const express = require('express')
const cookieParser = require('cookie-parser');
const session = require('express-session');  //To store userId after login
const app = express()
const port = 3001


const USERS = [
  {
    userId: "sudheer",
    pwd: "test1",
    role: "admin"
  },
  {
    userId: "arun",
    pwd: "test2",
    role: "user"
  }
]
;

const QUESTIONS = [{  
      title: "Two states Max",
      description: "Given an array , return the maximum of the array?",
      testCases: [{
          input: "[1,2,3,4,5]",
          output: "5"
      }]
    },
    {  
      title: "Two states Min",
      description: "Given an array , return the min of the array?",
      testCases: [{
          input: "[1,2,3,4,5]",
          output: "5"
      }]
    }
    ];


const SUBMISSION = [
  {
    "userId": "sudheer",
    "problemId": "1",
    "answer": "some code1"
  },
  {
    "userId": "sk",
    "problemId": "2",
    "answer": "some code2"
  }
]

// Define user roles (only admin can set it on the users as role)
const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};


// Middleware to decode the request body as JSON
app.use(express.json());
app.use(cookieParser());
//Session middleware
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));

function validateNotNullOrEmpty(value) {
  return value !== null && value !== undefined && value !== '';
}

function isAdmin(userId){
   let user = USERS.find((user)=>user.userId === userId && user.role === "admin");
   return user != null ? true : false;
}

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const content = req.body;
  // body should have email and password
  if (!validateNotNullOrEmpty(content.userId) || !validateNotNullOrEmpty(content.pwd)){
    res.status(400).send('{"code":"400","message": "Missing userId or pwd."}');
    return;
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let user = USERS.find((user)=>user.userId == content.userId && user.pwd == content.pwd);
  if (!user){
    USERS.push({
      userId: content.userId,
      pwd: content.pwd
    });
    // return back 200 status code to the client
    res.status(200).send('{"code":"200", "message": "User signed up successfully"}');
  } else {
    //409 - Conflict
    res.status(409).send('{"code":"409","message": "User already signed up, pelase login."}');
  }
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const content = req.body;
  // body should have email and password
  if (!validateNotNullOrEmpty(content.userId) || !validateNotNullOrEmpty(content.pwd)){
    res.status(400).send('{"code":"400","message": "Missing userId or pwd"}');
    return;
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let user = USERS.find((user)=>user.userId == content.userId && user.pwd == content.pwd);
  
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  let message = '';
  if (user){
    //Set auth cookie
    req.session.userId = content.userId;
    res.cookie('authToken', Date.now(), { maxAge: 3600000, httpOnly: true });
    res.status(200).send('{"code":"200","message": "Login successful"}');
    return;
  } else {
    //401 - Not authenticated
    res.status(401).send('{"code":"401","message": "Failed to authenticate"}');
    return;
  }
})

app.get('/questions', function(req, res) {
  //Check if the user has logged-in
  if (!req.cookies && !req.cookies.authToken){
    res.status(401).send('{"code":"401","message": "Failed to authenticate, please login before calling this method."}');
    return;
  } 

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
  return;
})

app.get("/submissions", function(req, res) {
  //Check if the user has logged-in
  if (!req.cookies.authToken){
    res.status(401).send('{"code":"401","message": "Failed to authenticate, please login before calling this method."}');
    return;
  } 

   // return the users submissions for this problem
   const { userId } = req.body;
   const submissions = SUBMISSION.filter((item)=>item.userId === userId);
   if (submissions){
    res.json(submissions);
    return;
   }else {
    //404 - Not found
    res.status(404).send('{"code":"404","message": "Failed to find any submissions for the given user and problem."}');
    return;
   }
  
});


let acceptAnswer = false;  //Default
app.post("/submissions", function(req, res) {
  //Check if the user has logged-in
  if (!req.cookies.authToken){
    res.status(401).send('{"code":"401","message": "Failed to authenticate, please login before calling this method."}');
    return;
  } 
  
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { userId, problemId, answer } = req.body;
   //Randomly accept or reject it
   acceptAnswer = !acceptAnswer; 
   const submission = SUBMISSION.find((item)=>item.userId === userId && item.problemId === problemId);
   if (!submission){                                                            
      if (acceptAnswer){
        SUBMISSION.push({
          "userId": userId,
          "problemId": problemId,
          "answer": answer
        });
        res.status(200).send('{"code":"400","message": "Submission accepted (random) and saved"}');
        return;
      }else{
        res.status(200).send('{"code":"400","message": "Submission rejected (random), see errors"}');
        return;
      }
   } else {
    if(acceptAnswer){
      //overwrite the existing answer
      submission.answer = answer;
      res.status(200).send('{"code":"200","message": "Submission accepted and updated"}');
      return;
    } else {
      {
        res.status(200).send('{"code":"400","message": "Submission rejected (random), see errors"}');
        return;
      }
    }
   }

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
// ANSWER: Using role at the user level, need an endpoint to set it by admin
app.post("/questions", function(req,res){
  //Check if the user has logged-in and has a valid userId
  const userId = req.session.userId;
  if (!(req.cookies.authToken && userId)){
    res.status(401).send('{"code":"401","message": "Failed to authenticate, please login before calling this method."}');
    return;
  } 
  
  const question  = req.body;
  if (!isAdmin(userId)){
    res.status(401).send('{"code": "401", "message": "Unauthorized, please login as admin."}');
    return;
  }

  let result = QUESTIONS.find((q)=>q.title === question.title);
  if (result){
    res.status(409).send('{"code": "409", "message": "A question with the same title already exists."}');
    return;
  } else{
    QUESTIONS.push(question);
  }
  res.status(200).send('{"code": "200", "message": "The question was added sunncessfully."}');
    return;
});

//==================================================//

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})