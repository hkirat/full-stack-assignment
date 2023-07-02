const express = require('express')
const app = express()
const port = 3001

const USERS = [
  {
    name: "User",
    email: "user@gmail.com",
    password: "user123",
    role: "user",
    userId: "User90"
  },
  {
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    userId: "Admin520"
  }
];

const QUESTIONS = [
  {
    title: "Max value in array",
    description: "Given an array , return the maximum value in the array.",
    quesId: "Max value in array458",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    title: "Min value in array",
    description: "Given an array , return the minimum value in the array.",
    quesId: "Min value in array33",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "1"
    }]
  }
];

const SUBMISSION = [
  {
    quesId: "Max value in array458",
    userId: "User90",
    code: "..code..",
    status: "Solved"
  },
  {
    quesId: "Max value in array458",
    userId: "User90",
    code: "..code..",
    status: "Not Completed"
  }
]

// Middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({extended: true}));

// Middleware function to check if the user is an admin
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.redirect("/");
  }
  if (req.user.role === "admin") {
    // User is admin, give access to the page
    return next();
  }else{
    // Redirect to homepage for non-admin users
    return res.redirect("/");
  }
}


// Route for homepage
app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/public/index.html");
});

// Routes for login/signup
app.get("/signup",(req,res)=>{
  res.sendFile(__dirname+"/public/signup.html");
});

app.get("/login",(req,res)=>{
  res.sendFile(__dirname+"/public/login.html");
});


app.post('/signup',(req, res)=>{
  
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.cfrmpass) {
    // If required fields are missing, send a 400 Bad Request response
    return res.status(400).json({ message: "Missing required fields" });
  }
  if(req.body.password!==req.body.cfrmpass){
    return res.status(400).json("Password is not same");
  }
  // Random no for user id
  const randomNum = Math.floor(Math.random() * 1000);

  // Adding signup data into users array
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: "user",
    userId: req.body.name + randomNum
  };
  USERS.push(newUser);

    // Set req.user with the user object
    req.user = newUser;

    // return back 200 status code to the client
    // res.status(200).redirect("/");
    res.sendStatus(200);
});


app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let userFound = false;

  USERS.forEach(user => {
    // Check if the user with the given email exists in the USERS array and password is the same or not
    if (user.email === email && user.password === password) {
      // User found, set req.user with the user object
      req.user = user;
      let token = user.userId;

      userFound = true;
      // If password is the same, return back 200 status code to the client/redirect to home page
      // return res.status(200).redirect("/");
      return res.status(200).json(token);
    }
  });

  // If no user is found or password is incorrect, return back 401 status code to the client
  if (!userFound) {
    return res.status(401).json("Incorrect Email/Password");
  }
});


// Routes for questions/submissions
app.get("/addQuestion", (req, res)=>{
  res.sendFile(__dirname+"/public/addQuestion.html")
});

app.get("/question",(req,res)=>{
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions/:quesId/:userId", (req, res)=>{
   // return the users submissions for this problem
   const quesId=req.params.quesId;
   const userId=req.params.userId;
   let history=[];
   let attempts=1;

   SUBMISSION.forEach(submission=>{
    // If the userId and quesId matches then store the submission history in array
    if(submission.userId===userId && submission.quesId===quesId){
      history.push({
        attempt: attempts,
        code: submission.code,
        status: submission.status
      });
      attempts++;
    }
   })
   res.json("Submission History",history);
});

app.post("/submissions/:quesId/:userId", (req, res)=>{
   // let the user submit a problem, randomly accept or reject the solution
   let quesStatus=Math.floor(Math.random()*2);

   // Store the submission in the SUBMISSION array above
   let userSub={
    quesId: req.params.quesId,
    userId: req.params.userId,
    code: req.body.code,
    status: quesStatus?"Solved":"Not completed"
   }
   SUBMISSION.push(userSub);

   res.status(200).json("Succesfully submitted!",userSub);
});

// Create a route that lets an admin add a new problem
app.post("/addQuestion",isAdmin,(req,res)=>{
  // Random no for question id
  const randomNum = Math.floor(Math.random() * 1000);
  // Store the new question into the array
  const newQuestion={
    title: req.body.title,
    description: req.body.description,
    quesId: req.body.titl+randomNum,
    testCases: req.body.testCases
  }
  QUESTIONS.push(newQuestion);
  return res.status(200).json("New question added!",newQuestion);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});