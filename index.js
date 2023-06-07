const express = require('express')
const app = express()
const port = 3000

const USERS = [{
  email:'user1@gmail.com',
  password:'12390'
},
{
  email:'user2@gmail.com',
  password:'12345'
}
];

const QUESTIONS = [{
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},{
    id: 2,
    title: "three sum",
    description: "Given an array , return the maximum of any 3 numbers in the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "12"
    }]
}
];

const SUBMISSION = [{
  id: 1,
  title: 'three sum',
  solution: 'sort the array and add last 3 numbers'
}
]
//const tempstroage=[];
app.use(express.json());

app.post('/signup', function(req, res) {
   const email=req.body.email;
   const password=req.body.password;

   const existingcheck=USERS.find(user=> user.email===email);
   if(!existingcheck){
    res.status(409).send('The mail id already exiting....!!');
   }
   else{
    const newuser={email,password};
    USERS.push(newuser);
    res.status(200).send('You are successfully signed up!!');
   }

  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  // res.send('Hello World!')
})

app.post('/login', function(req, res) {
   const email=req.query.email;
   const password=req.query.password;

   const user=USERS.find(users => users.email===email);
   if(!user){
    res.status(401).send('user doesnot exiting yet...!!');
   }
   else if(user.password===password){
    res.status(200).send("Login is successfully done.....!!");
   }
   else{
    res.status(401).send('Wrong password as entered....!');
   }
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  //res.send('Hello World from route 2!')
})
app.get('/questions', function(req, res) {
   res.json(QUESTIONS);
  //return the user all the questions in the QUESTIONS array
  //res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   const {id , title}=req.query;

   const requireedsubmission=SUBMISSION.find(sub=>{
    return sub.id === parseInt(id) && sub.title.toLowerCase() === title.toLowerCase();
    //return sub.id === parseInt(id) && sub.title === title;
    // return sub.id===id && sub.title===title;
   })
   if(!requireedsubmission){
    res.send(404).json({error:'submission not found'});
   }
   res.json(requireedsubmission);
    //http://localhost:3000/submissions?id=1&title=three%20sum to get a submission use this once
   // return the users submissions for this problem
  //res.send("Hello World from route 4!")
});


app.post("/submit", function(req, res) {
   const {id, title,solution}=req.body;
   if(!id || !title || !solution){
    res.status(404).json({error:'Mssing some field'});
   }
   const newsubmission={
        id:id,
        title:title,
        solution:solution
   };
   SUBMISSION.push(newsubmission);
   res.status(200).json({Message:'Running successfully.....!!'})
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  //res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// app.listen(port, function() {
//   console.log(`Example app listening on port ${port}`)
// })