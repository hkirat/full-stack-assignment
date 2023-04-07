const express = require('express')
const app = express()
const port = 3001
 
// # To read from post request we need to use body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
// # Serving static html files
app.use(express.static('public')) ;

const USERS = [
  {
    name: "testuser",
    emailId: "testuser@gmail.com",
    role: "user",
    passwd: "testuser",
    uid: "testuser" + 100
  },
  {
    name: "testadmin",
    emailId: "testadmin@gmail.com",
    role: "admin",
    passwd: "testadmin",
    uid: "testadmin" + 100
  }
];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    qId: 1,
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    title: "Min state",
    description: "Given an array , return the minimum of the array?",
    qId: 2,
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "1"
    },
    {
      input: "[-1,-2,-3,-4,-5]",
      output: "-5"
    }
    ]
  }
];


const SUBMISSION = [

]


//            ************* For Testing Purpose ******************

//  # Adding an initial route for users to show them options they can choose
app.get('/',(req,res)=> {
  // # Using sendFile to send html file in public DIR
  res.sendFile( __dirname + '/public/index.html') ;
})

// #Adding route for sign up page
app.get('/signup',(req,res)=>{
  res.sendFile(__dirname + '/public/signup.html') ;
})

// #Adding route for log in page
app.get('/login',(req,res)=>{
  res.sendFile(__dirname + '/public/login.html')
})

// #Adding route to check and post submission
app.get('/submit', (req,res)=>{
  res.sendFile(__dirname + '/public/submit.html') ;
})

app.get('/addques',(req,res)=>{
  res.sendFile(__dirname + "/public/addques.html")
})

//            ************* For Testing Purpose ******************


app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const Uname = req.body.name ;
  const UemailId = req.body.email;
  const Urole = req.body.role;
  const Upasswd = req.body.passwd;

  userNum = Math.floor(Math.random()*100) ;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userData = {
    name: Uname,
    emailId: UemailId,
    role: Urole,
    passwd: Upasswd,
    uid: Uname + userNum
  } ;

  // # Push the object to USERS Array
  USERS.push(userData) ;

  // return back 200 status code to the client
  res.sendStatus(200) ;
})


app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const UemailId = req.body.email;
  const Upasswd = req.body.passwd;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let correctUser = false;
  let userToken = {
    token: null
  }
  for (let i=0; i<USERS.length; i++){
    if (USERS[i].emailId === UemailId && USERS[i].passwd === Upasswd ){
      correctUser = true;
      userToken.token = USERS[i].uid ;
      break;
    }
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if (correctUser){
    res.status(200).json(userToken) ;
  }
  // If the password is not the same, return back 401 status code to the client
  else{
    res.sendStatus(401) ;
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions/:uId/:qId", function(req, res) {
  // return the users submissions for this problem
  let subHist = [] ;
  let i = 0;
  SUBMISSION.forEach((subs)=>{
    if (subs.uId === req.params.uId && subs.qId === req.params.qId){
      subHist.push({attempt: i , status: subs.status }) ;
      i=i+1;
    }
  })
  res.json(subHist) ;
});


app.post("/submissions/:uId/:qId", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const probablity = Math.floor(Math.random()*2) ;
  const acc = probablity==0 ? "Not Accepted" : "Accepted" ; 
  SUBMISSION.push({uId: req.params.uId , qId: req.params.qId , status: acc}) ;
  res.sendStatus(200) ;
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addQuestion/:uId",(req,res)=>{
  let isAdmin = false;
  for (let i=0; i<USERS.length; i++){
    if (USERS[i].uid === req.params.uId && USERS[i].role === "admin"){
      isAdmin = true;
      break;
    }
  }
  
  if (isAdmin){
    const data = req.body;
    const ques = {
        title: data.title,
        description : data.desc,
        qId : data.title + Math.floor(Math.random()*100),
        testCases : [{input : data.input , output: data.output }]
    }

    QUESTIONS.push(ques) ;
    res.sendStatus(200) ;
  }
  else{
    res.status(401).json({staus: "Unauthorised" , message: "Only admins are allowed to add question"}) ;
  }
})

app.listen(port, function() {
  console.log(`Example app listening on port http://localhost:${port}`)
})