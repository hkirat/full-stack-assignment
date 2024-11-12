const express = require('express')
const app = express()
const port = 3001;
const cookieParser = require('cookie-parser');

app.set('view engine' , 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const USERS = [];

const QUESTIONS = [
    {
        id: "two-states",
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "5"
        }]
    },
    {
        id: "two-states-min",
        title: "Two states min",
        description: "Given an array , return the minimum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "1"
        }]
    },
    {
            id: "arr-avg",
            title: "Average of Array",
            description: "Given an array , return the average of all values of the array.",
            testCases: [{
                input: "[1,2,3,4,5]",
                output: "7.5"
            }]
    }        
];


const SUBMISSION = [

]

app.get('/' , (req,res)=>{
    res.render('index');    
})

app.post('/signup', function(req, res) {
    let { email , password } = req.body;

    let userExists = false;

    USERS.map((u) => {
        if(u.email === email){
            userExists = true;
        }
    });

    if(userExists){
        res.status(400).send("User already signed up, please login <br/><br/> <a href='/'>Go Back to Home Page</a>"); 
    }
    else{
        USERS.push({email,password});
        res.status(200).send('You have Signed up! <br/><br/> <a href="/">Go Back to Home Page</a>');

    }

    
    console.log(USERS);
    
    
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  
});

app.post('/login', function(req, res) {
    let {email , password} = req.body;
    let user = USERS.filter((u)=> {
        if(u.email === email && u.password === password){
            return u;
        }
    });
    console.log(user);

    if(user[0]){
        let email = user[0].email;
        let token = "abcd";
        if(email === "admin"){
            token = "admin";
        }
        res.cookie("token" , token);
        res.status(200).send("Login Successfull <br/><br/> <a href='/'>Go Back to Home Page</a>");
        
    }
    else{
        res.status(400).send("Login Error <br/><br/> <a href='/'>Go Back to Home Page</a>");        
    }
    
    // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.render('question-set', {QUESTIONS});
});

app.get('/questions/:id' , (req, res)=>{
    let qid = req.params.id;
    let question = QUESTIONS.filter((q)=> q.id === qid)[0];
    if(!question){
        res.status(400).send("Question not found");        
    }
    else{
        res.render('question',{question});
    }
});

app.get("/questions/:id/submissions", function(req, res) {
   // return the users submissions for this problem

   let qid = req.params.id;   

   let submissions = SUBMISSION.filter((s)=> s.id === qid);  

  res.render('submissions' , {submissions});
});


app.post("/questions/:id/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

   let submission = {
    id : req.params.id,
    code : req.body.code
   }; 

   SUBMISSION.push(submission);
    

  res.redirect(`/questions/${submission.id}/submissions`);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/questions", (req , res) => {
    const token = req.cookies.token;

    if(!token){
        res.send("Please Login First <br/><br/> <a href='/'>Go Back to Home Page</a>");
    }
    else if(token === "admin"){
        let q = req.body;
        console.log(q);
        let question = {
            id: q.id,
            title: q.title,
            description: q.description,
            testCases: [{
                input: q.input,
                output: q.output
            }]
        }
        QUESTIONS.push(question);
        res.redirect("/questions");
    }
    else{
        res.send("You are not allowed to add a question");
    }
    
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})