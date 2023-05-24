const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

const USERS = [
  {
    email: "rakeshindupuri@gmail.com",
    password: "8842",
    isAdmin: true,
  },
  {
    email: "admin2@gmail.com",
    password: "I_am_admin",
    isAdmin: true,
  },
];
app.use(bodyParser.urlencoded({extended:true}))
const QUESTIONS = [
  {
    title: "1. Two states",
    acceptance: "50.4%",
    difficulty: "medium",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
  },
  {
    title: "2. Two Sum",
    acceptance: "49.9%",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
  },
  {
    title: "3. Add Two Numbers",
    acceptance: "40.5%",
    difficulty: "Medium",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
  },
  {
    title: "4. Longest Substring Without Repeating Characters",
    acceptance: "33.8%",
    difficulty: "Medium",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
  },
  {
    title: "5. Median of Two Sorted Arrays",
    acceptance: "36.4%",
    difficulty: "Hard",
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\nThe overall run time complexity should be O(log (m+n)).",
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
  }
];


const SUBMISSION = [

]

app.get("/",function(req,res)
{
  res.send(
    `
<body>
    <form  method="POST">
        <input type="email" name="email">
        <input type="password" name="password">
        <button formaction="/signup">Sign up</button>
        <button formaction="/login">Log In</button>
    </form>
</body>
    `
  );
})



app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client

  const email = req.body.email
  const password = req.body.password
  const userExists = USERS.find(user=>user.email===email)
  if(userExists)
  {
    res.status(409).send("User already exists")
    return
  }
  USERS.push({ email, password });
  res.status(200)
  res.send("Your SignUp is Successfull")
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const email = req.body.email
  const password = req.body.password

  const userExists = USERS.find(user=>user.email===email&&user.password===password)
  if(userExists)
  {
    res.status(200)
    setTimeout(()=>{res.redirect("/questions")},500)
    return
  }
  if(USERS.password!==password)
  {
    res.status(401)
    res.send("Incorrect emailId and password")
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  
    const questionsHTML = QUESTIONS.map(
      (question) => `
    <div>
    <p>Title: ${question.title}</p>
    <p>Description: ${question.description}</p>
    <p>Acceptance: ${question.acceptance}</p>
    <p>Difficulty: ${question.difficulty}</p>
    <ul>
      ${question.testCases.map(
        (testCase) =>
          `<li>Testcases: ${testCase.input}</li>
        <li>Output: ${testCase.output}</li>
        `).join('')}
    </ul>
    <form method="get">
    <button formaction="/submissions">Solve</button>
    </form>
    </div>
    `
    ).join("");
  
    res.send(questionsHTML)
})

app.get("/submissions", function(req, res) {
  res.send(
    `
   <textarea rows="30" cols="130"></textarea>
   <form name="submission" method="post">
   <button formaction="/submissions">submit</button>
   </form>
   `
  );
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  let user_submission = req.body.submission
   let randomNum = Math.random()
   if(randomNum<0.45)
   {
      SUBMISSION.push(user_submission)
      res.send(`
      <h2>Your Submission is Aceepted</h2>
      <form method="get">
      <button formaction="/questions">Back to Questions</button>
      </form>
      `);
   }
  res.send(
    `
    <h2>Your Submission is rejected</h2>
    `
  )
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.get("/admin",function(req,res)
{

  // Find the user in the USERS array based on email and password
  const user = USERS.find((u) => u.isAdmin===true);
  
  if (user) {
    res.send(
      `
      <h2>Add a new problem</h2>
      <form action="/admin" method="post">
      Title: <input name="title"> <br>
      Acceptence: <input name="acceptance"> <br>
      Difficulty: <input name="difficulty"> <br>
      Description: <textarea name="description"></textarea><br>
      Test Cases : <input name="input"> <br>
      Output: <input name="output">
      <button formaction="/admin">Submit</button>
      </form>
      `
    );
  }
  res.send("Only admins has access to this page")
})

app.post("/admin",function(req,res)
{
  let newProblem = {
    title: req.body.title,
    acceptance: req.body.acceptance,
    difficulty: req.body.difficulty,
    description: req.body.description,
    testCases:[
      {
      input:req.body.input,
      output:req.body.output,
      },
    ],
  };

  QUESTIONS.push(newProblem)
  res.send("Questions Added Successfully")
})
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
