const express = require('express');
const jwt = require('jsonwebtoken');
const {auth, checkRole} = require('./middleware')

const app = express();

//body parser
const bodyParser = require('body-parser');
// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const port = 3001;

let USERS = [];
let userCounter = 0;

const PROBLEMS = [
  {
    problemId: "1",
    title: "401. Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%",
    description:
      "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    exampleIn: "left = 5, right = 7",
    exampleOut: "4",
  },
  {
    problemId: "2",
    title: "205. Add two numbers",
    difficulty: "Medium",
    acceptance: "41%",
    description:
      "Given two numbers, add them and return them in integer range. use MOD=1e9+7",
    exampleIn: "a = 100 , b = 200",
    exampleOut: "300",
  },
  {
    problemId: "3",
    title: "202. Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: "Write an algorithm to determine if a number n is happy.",
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "4",
    title: "203. Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%",
    description: "Given number k , removed kth element",
    exampleIn: "list: 1->2->3 , k=2",
    exampleOut: "1->3",
  },
  {
    problemId: "5",
    title: "201. Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%",
    description:
      "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    exampleIn: "left = 5, right = 7",
    exampleOut: "4",
  },
  {
    problemId: "6",
    title: "205. Add two numbers",
    difficulty: "Medium",
    acceptance: "41%",
    description:
      "Given two numbers, add them and return them in integer range. use MOD=1e9+7",
    exampleIn: "a = 100 , b = 200",
    exampleOut: "300",
  },
  {
    problemId: "7",
    title: "202. Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: "Write an algorithm to determine if a number n is happy.",
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "8",
    title: "203. Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%",
    description: "Given number k , removed kth element",
    exampleIn: "list: 1->2->3 , k=2",
    exampleOut: "1->3",
  },
];


const SUBMISSIONS = [

  {
    userId : "0",
    problemId : "1",
    title : "Two Sum",
    verdict : "AC",
  },
  {
    userId : "0",
    problemId : "1",
    title : "Two Sum",
    verdict : "WA",
  }

]

app.get('/',(req,res)=>{
  res.json({
    msg:"success",
  })
})

app.post('/signup', function(req, res) {


  // Add logic to decode body
  // body should have email and password

  const email = req.body.email;
  const password = req.body.password;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const index = USERS.findIndex((user)=>user.email == email);

  if(index == -1){
    USERS.push({email,password,id:userCounter++});
    res.json({msg:"User Created Successfully"})
  }
  else
    // return back 200 status code to the client
    res.status(403).json({msg:"User already exists"});

})



app.post('/login', function(req, res) {

  const email = req.body.email;
  const password = req.body.password;

  const user  = USERS.find((user)=>user.email == email);

  if(!user)
    return res.status(401).json({msg:"User not available"});

  else if(password != user.password)
    return res.status(401).json({msg:"Incorrect Password"});

  else{
    const token = jwt.sign({
      userId:user.id
    },'SECRET_KEY');

    const role = (Math.random() < 0.5) ? "Admin" : "User";

    res.status(200).json({token, role});
  } 

})

app.get('/problems', function(req, res) {

  const problems = PROBLEMS.map((problem)=>({
    problemId:problem.problemId,
    title:problem.title,
    acceptance:problem.acceptance,
    difficulty:problem.difficulty,
  }))

  res.json({
    problems,
  })


})

app.get("/submissions/:id",auth,(req,res)=>{

    const problemId = req.params.id;
    const userId = req.userId;

    const submissions = SUBMISSIONS.filter((sub)=> sub.problemId == problemId && sub.userId == userId);
    return res.json({submissions});
})


app.post("/submit",auth, function(req, res) {
   
  const userId = req.userId;
  const title = req.body.title;
  const problemId = req.body.problemId;
  const verdict = ( Math.random() < 0.5 ) ? "WA" : "AC";

  const submission = {userId,problemId,title,verdict}

  SUBMISSIONS.push(submission);

  res.json({submission});


});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addproblem", auth, checkRole, (req,res)=>{
  const title = req.body.title;
  const difficulty = req.body.difficulty;
  const acceptance = req.body.acceptance;
  const description = req.body.description;

  const newProblem = {title, difficulty, acceptance, description};
  PROBLEMS.push(newProblem);

  res.json({allProblems : PROBLEMS});
})

app.get("/problem/:id", (req,res)=>{
  const problemId = req.params.id;

  const problem = PROBLEMS.find((prob)=> prob.problemId == problemId);

  if(!problem)
    return res.json({msg:"No such Problem"})

  res.json({
    problem,
  })
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})




