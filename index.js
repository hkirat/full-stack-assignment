const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;
const bodyparser = require('body-parser');
const USERS = [];
app.use(express.json());

 let userid = 0;
 let questionid = 0;

const QUESTIONS = [];

const SUBMISSION = [];

function userExists(email) {
  return USERS.find((user) => user.email === email);
 
}

function auth(password) {
  return USERS.find((user) => user.password === password);
}

function isAdmin(email) {
  let selectedUser = userExists(email);
  let userRole = USERS.find((element) => element.role === selectedUser.role);
  return userRole.role === 'admin' ? true : false
  
}

function userIdExists(userid) {
  return USERS.find((user) => user.userid == userid);
}

function questionExists(questionid) {
  return QUESTIONS.find((question) => question.questionid == questionid);
}

app.post('/signup', function(req, res, next) {
                                                              // Add logic to decode body
                                                              // body should have email and password
                                                              //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
                                                              // console.log(USERS);
                                                              // return back 201 status code to the client
  const {email , password , role} = req.body;

  if(!email || !password) {
    return res.status(400).send({error:"Please fill all the required form details"});
  }
  
   if(userExists(email)) {
    return res.status(409).send("User Aready Exists")
   } 
  
  userid++;
 
   USERS.push({userid,email,password,role});

   console.log(USERS);

  res.status(201).send('User Created successfully');

})

app.post('/login', function(req, res , next) {
                                                                              // Add logic to decode body
                                                                              // body should have email and password
                                                                              // Check if the user with the given email exists in the USERS array
                                                                              // Also ensure that the password is the same
                                                                              // If the password is the same, return back 200 status code to the client
                                                                              // Also send back a token (any random string will do for now)
                                                                              // If the password is not the same, return back 401 status code to the client
  const {email,password} = req.body;
 
  if(!email || !password) {
      return res.status(400).send("Enter the email and password");
  }
  
  if (!userExists(email)||!auth(password)) {
    return res.status(401).send("Invalid email or password")
   }
  
   res.status(200).send("Successfully Logged In");

})

app.get('/questions', function(req, res) {

                                                                                    //return the user all the questions in the QUESTIONS array
      res.status(200).json(QUESTIONS)
 
})

app.get("/submissions", function(req, res) {
                                                                                          // return the users submissions for this problem
  const userid = req.body.userid;
  let user = userExists(userid)
  let submissions = SUBMISSION.filter((submission) => submission.userid == userid);
  console.log(submissions);
  return res.status(200).json(submissions);
});


app.post("/submissions", function(req, res) {
                                                                                           // let the user submit a problem, randomly accept or reject the solution
                                                                                            // Store the submission in the SUBMISSION array above
   const { userid, questionid, code} = req.body;
   
   if(!code) {
    return res.status(400).send("Please code your answer");
  }

  if (!userIdExists(userid)||!questionExists(questionid)) {
    return res.status(401).send("user or question doesn't exist");
  }

let random =  Math.floor(Math.random() * 10) + 1;
let status = "Rejected"

if (random <=5 ) {
  status = "Accepted";
}
  
  SUBMISSION.push({userid,questionid,code,status});

  console.log(SUBMISSION);
  return res.status(201).send("Answer submitted succesfully");
});

                                                                  // leaving as hard todos
                                                                  // Create a route that lets an admin add a new problem

app.post("/questions", (req , res , next) => {
  const {email, title, description, testcases} = req.body;

  if(!userExists(email)) {
    return res.status(400).send("User doesn't exist");
  }

  if (!isAdmin(email)) {
    return res.status(403).send("User not autherised");
  }
  
  questionid++;

  QUESTIONS.push({email, questionid, title, description, testcases});

  console.log(QUESTIONS);

  return res.status(201).send("Question succesfully added");

})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})