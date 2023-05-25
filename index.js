const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 5050

const USERS = [{admin : "true",username:"ridaa@gmail.com",password:"1234Ridaa"}];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];
app.use('/js', express.static(__dirname + '/js'));


const SUBMISSION = [

]
app.get('/',(req,res)=>{
  res.render("home") ; 
})
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));


app.set('views', __dirname + '/views');

app.get('/signup',(req,res)=>{
  res.render("signup");
})

app.post('/signup', (req, res) =>{
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  const usernameInBody  = req.body.username;
  const passwordInBody  = req.body.pass;
  const isAdmin = req.body.admin;
  const userExists = USERS.some(user=> user.username === usernameInBody);
  if(userExists){
    console.log("User Already exists");
    return res.status(200).redirect("login");
  }
  else{
    let signupDetails = {
      admin : `${isAdmin}`,
      username : `${usernameInBody}`,
      password : `${passwordInBody}`,
    }
    USERS.push(signupDetails);
    return res.sendStatus(200);
  }
  
})
// app.get("/login",(req,res)=>{
//   res.render("login");
// })
// app.post('/login', (req, res) =>{
//   // Add logic to decode body
//   // body should have email and password

//   // Check if the user with the given email exists in the USERS array
//   // Also ensure that the password is the same


//   // If the password is the same, return back 200 status code to the client
//   // Also send back a token (any random string will do for now)
//   // If the password is not the same, return back 401 status code to the client


//   const usernameInBody  = req.body.username;
//   const passwordInBody  = req.body.pass;
//   const validUser = USERS.some(user=> {user.username === usernameInBody && user.password === passwordInBody});
//   const userExists = USERS.some(user=> user.username === usernameInBody);
  
//   if(validUser){
//     console.log("Valid User");
//     return res.status(200).redirect('questions');
//   }
//   if(userExists){
//     allert("Wrong Password");
//     return res.sendStatus(401);
//   }
//   else{
//     return res.status(200).redirect('signup');
//   }
  
// })

// app.get('/questions', (req, res)=> {

//   //return the user all the questions in the QUESTIONS array
//   res.send("Hello World from route 3!")
// })

// app.get("/submissions", (req, res)=> {
//    // return the users submissions for this problem
//   res.send("Hello World from route 4!")
// });


// app.post("/submissions", (req, res)=> {
//    // let the user submit a problem, randomly accept or reject the solution
//    // Store the submission in the SUBMISSION array above
//   res.send("Hello World from route 4!")
// });

// // leaving as hard todos
// // Create a route that lets an admin add a new problem
// // ensure that only admins can do that.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});
app.listen(port, () =>{
  console.log(`Example app listening on port ${port}`)
})