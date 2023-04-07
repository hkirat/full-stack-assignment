const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION =[
  {
    "id": 1,
    "title": "Two Sum",
    "code": "function twoSum(nums, target) {\n  // implementation\n}",
    "email": "john@example.com",
    "accepted":true
  },
  {
    "id": 2,
    "title": "Add Two Numbers",
    "code": "class Solution:\n    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:\n        # implementation",
    "email": "jane@example.com",
    "accepted":"false"
  },
  {
    "id": 3,
    "title": "Longest Substring Without Repeating Characters",
    "code": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // implementation\n    }\n}",
    "email": "bob@example.com",
    "accepted":true
  },
  {
    "id": 4,
    "title": "Median of Two Sorted Arrays",
    "code": "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // implementation\n    }\n};",
    "email": "alice@example.com",
    "accepted":false
  }
]

const ADMINS =[
  {
    email:"crazy@gmail.com",
    password:"crazypass"
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const {body} = req
  // body should have email and password
   
  if(!(body.password && body.email)) {
     res.status(400).end("User Password or Email missing")
  }
  
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
   USERS.push({
    email: body.email,
    password: body.password
   })

  // return back 200 status code to the client
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    const {body} = req
  
    if(!(body.password && body.email)) {
     res.status(400).end("User Password or Email missing")
  }


  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email ===email && user.password ===password)

  if(!user) {
    res.status(401).end("Email or Password Incorrect")
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token="Valid User"

  res.send(token)
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   console.log("Get Submissions Hit")
  const {title,email} = req.body
  console.log(JSON.stringify(req.body))
  const userSubmissions = SUBMISSION.filter(submission => submission.email === email && submission.title==title)
  

   // return the users submissions for this problem
  res.json(userSubmissions)
});

const adminAuth = (req, res,next) =>{

     const {email,password} =req.body

     const isAdmin = ADMINS.find( admin => admin.email === email && admin.password === password) 

     if(!isAdmin) {
         res.status(401).send("Invalid Admin")
         return
     }

     next()
}

app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

   // assuming the body will be a  json object with the proper question format
   const body = req.body;

   const isAccepted = Math.random()*10 >5
   const numbersArray=SUBMISSION.map(submission => submission.id)
   const id = Math.max(...numbersArray)+1

   console.log("id is",id)
   SUBMISSION.push({
      ...body,
      accepted:isAccepted,
      id
   })
   
   console.log("The submissions are",SUBMISSION)
   res.send(`Submission is ${isAccepted}`)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.



app.post('/question',adminAuth,(req, res)=>{ 

     const {question} = req.body
     
     QUESTIONS.push(question)

     res.status(201).send("Question Successfully Added By Admin")
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})