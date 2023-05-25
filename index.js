const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 5050

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/js', express.static(__dirname + '/js'));


const USERS = [{admin : "true",username:"ridaa@gmail.com",password:"1234Ridaa"}];

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
app.get('/',(req,res)=>{
  res.render("home.ejs") ; 
})





app.get('/signup',(req,res)=>{
  res.render("signup.ejs");
});
app.get("/login",(req,res)=>{
  res.render("login.ejs");
});
app.post('/signup', (req, res) =>{
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  const usernameInBody  = req.body.username;
  const nameInBody  = req.body.name;
  const passwordInBody  = req.body.pass;
  const isAdmin = req.body.admin;
  const userExists = USERS.some(user=> user.username === usernameInBody);
  if(userExists){
    console.log("User Already exists");
    return res.status(200).redirect("login");
  }
  else{
    let signupDetails = {
      name: `${nameInBody}`,
      admin : `${isAdmin}`,
      username : `${usernameInBody}`,
      password : `${passwordInBody}`,
    }
    USERS.push(signupDetails);
    return res.redirect("questions");
  }
  
});
app.post('/login', (req, res) =>{
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  const usernameInBody  = req.body.username;
  const passwordInBody  = req.body.pass;
  const validUser = USERS.some(user=> user.username === usernameInBody && user.password === passwordInBody);
  const userExists = USERS.some(user=> user.username === usernameInBody && user.password != passwordInBody);
  
  if(validUser){
    console.log("Valid User");
    return res.status(200).redirect('questions');
  }
  if(userExists){
    // alert("Wrong Password");
    return res.sendStatus(401);
  }
  else{
    return res.redirect('signup');
  }
  
});

app.get('/questions', (req, res)=> {

  res.render("questions.ejs",{questionslist : QUESTIONS})
})

app.get("/submissions", (req, res)=> {
   // return the users submissions for this problem
   const submissionList = SUBMISSION.map((sub)=>`<li>${sub}</li>`).join('')
  res.send(`
    <h1>SUBmissions are</h1>
    <ul>
    ${submissionList}
    </ul>
  `)
});


app.post("/submissions", (req, res)=> {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   SUBMISSION.push(req.body.submissions);
  res.send(`
      <h1>Thank you for submitting a problem!</h1>
      <p>Your subbmission is ${req.body.submissions}</p>
    `)
});

// // leaving as hard todos
// // Create a route that lets an admin add a new problem
// // ensure that only admins can do that.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});
app.listen(port, () =>{
  console.log(`Example app listening on port ${port}`)
});