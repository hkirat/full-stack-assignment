import express from "express";
const app = express()
const port = 3000

const USERS = [];

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
//adding middleware (are sort of inbuilt functions that give permissions to use certain expressJS features) to get data from post method to a js object
app.use(express.urlencoded({extended : true}));

//function that checks if the user is a new user or not:
const containsUser = (email,password)=>{
  for(let i=0; i<USERS.length; i++){
    if(USERS[i].email === email && USERS[i].password === password){
      return true;
    }
  }
  return false;
};

app.post('/signup', function(req, res) {

  const {email, password} = req.body;
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(!containsUser(email, password)){
    USERS.push(req.body);
  }
  
  // return back 200 status code to the client
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})