const express = require('express')
const path = require('path');
const crypto = require('crypto');

const app = express()
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); 
const port = 3001

let User_Token = '';
let IsAdmin = false;
let IsLoggedin = false;

const USERS = [{
  "email":"Vihaan_Shah@email.com",
 "password":"Apun_Abhi_Chand_Pe_hai",
 "IsAdmin":false
}
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

]

app.get('/', (req,res) =>
{
  const filePath = path.join(__dirname, 'client', 'index.html');
  res.sendFile(filePath);
  
});


app.get('/signup', (req, res) => {
  const filePath = path.join(__dirname, 'client' ,'signup.html');
  res.sendFile(filePath);
})


app.post('/signup', function(req, res){
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    // return back 200 status code to the client

  const {email , password} = req.body;
  IsAdmin = req.body.IsAdmin;
  const found = USERS.find((i) => i.email === email);
  if (found) {
    res.status(409).send("email already exist.");  //#409Conflict
  }
  else{
    IsAdmin = (IsAdmin) ? IsAdmin : false;
    USERS.push({email,password, IsAdmin});
    res.status(200).send('You have register sucessfully')
  }
})

function generate_token(length){
  User_Token = crypto.randomBytes(length).toString('hex');
  return User_Token;
}

app.post('/login', (req, res) => {

  const {email , password } = req.body;

  found = USERS.find((i) => i.email === email && i.password === password);

  if(found)
  {
    if(found.IsAdmin)
      res.status(200).send({messages:'You have Logged - in sucessfully', Admin_Token:generate_token(20)});
    else
      res.status(200).send({messages:'You have Logged - in sucessfully', User_Token:generate_token(20)});
      
    IsLoggedin = true;
  }
  else{
    res.status(401).send('Please Register First.....');
  }
  
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  
})

app.get('/questions', (req, res) => {
  data = req.body;
  if(IsLoggedin)
  {
    if (data.Token === User_Token)
      res.status(200).send(QUESTIONS)
    else
      res.status(401).send("Unauthorized Access Please Login...");
  }else{
    res.status(401).send("Unauthorized Access Please Login...");
  }

})


app.get("/submissions", (req, res) => {
   // return the users submissions for this problem
  data = req.body;
  if(IsLoggedin)
  {
    if (data.Token === User_Token)
      res.status(200).send(SUBMISSION);
    else
      res.status(401).send("Unauthorized Access Please Login...");
  }else{
    res.status(401).send("Unauthorized Access Please Login...");
  }
   
});


app.post("/submissions", (req, res) => {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   if(IsLoggedin){
    const code = req.body.solution.code;
    let i=1;
    if (code) {
      while (i <= 3) {
        console.log(`Test Case ${i} is executing...`);
        i++;
      }
      const body = {
        solution : code,
        isCorrect : Math.random() > 0.5
      }

      if(body["isCorrect"]){
        res.status(200).json({message:"correct solution"});
       }
       else{
        res.status(401).json({message:"incorrect solution"});
       }
       SUBMISSION.push(body);
    }
    else{
      res.status(401).send("No Code Found...");
    }
  }else{
    res.status(401).send("Unauthorized Access Please Login...");
  }

});



app.post("/add_problems", (req, res) => {
 
        const title = req.body.title;
        const description = req.body.description;
        const testCases = req.body.testCases;
      
          const existingProblem = QUESTIONS.find(problem => problem.title === title);
  
          if(existingProblem){
            return res.status(400).json({message:"problem already exists"});
          }
        
          const isAdmin = USERS.find(user => user.IsAdmin);
        
          if(isAdmin){
            QUESTIONS.push({title, description, testCases});
            res.status(200).json({message:"problem added successfully"});
          }
          else{
            res.status(401).json({message:"only admin can add problems"});
          }

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})