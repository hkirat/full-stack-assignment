const express = require('express')
const app = express()

const port = 3001

app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs");


const USERS = [{email:"atul@gmail.com", password:"pass"}];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of an array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }
  ]
},
{
  title: "Minimum Number",
  description: "Given an array , return the minimum of an array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "1"
  }
]
},
{
  title: " Number",
  description: "Given an array , return even numbers in the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "[2 4]"
  }
]
}


]; 


const SUBMISSION = [

]

app.get('/',(req,res)=>{
   
   res.render("signup",{title:"signup"});
})

app.post('/signup', (req, res)=> {
  
  const email=req.body.email;
  const password = req.body.pass;
  
  
 
  const object={
    email:email,
    password:password
  }

   if(!USERS.some(user=>{
      return user.email === object.email
   }))
   { if(password === req.body.matchpass)
    {

      USERS.push(object)
      res.redirect('/login');
    }
    else
    { 
      
      res.redirect("/")
       
    }

   }

     else{
       
     
        res.redirect('/login')
     
     }
  



   res.status(200).redirect("/login")
  
})

app.get('/login',(req,res)=>{
   
  res.render("login",{title:"login"});
})


app.post('/login', (req, res,next)=> {
  

  const email=req.body.email;
  const password = req.body.pass;
 
  
   if(USERS.some(user=>{
      return (user.email === email && user.password === password)
   })){
     const token = Math.random().toString(36).substring(2,20);
     
     res.cookie('token',token,{httpOnly:true})
     res.redirect('/questions');  
    

     
   }

   else {

     res.status(401).send("wrong credentials")     

   }
     
     




})





app.get('/questions', (req, res)=> {

  res.render("questions",{title:"Questions",questions:QUESTIONS})
})

app.get("/mysubmissions", (req, res)=> {
   // return the users submissions for this problem

  res.render("submissions",{title:"Submissions",submission:SUBMISSION})
});


app.post("/submissions", (req, res)=> {
 
   const codeObject={

     question_title: req.body.title,
     question_description:req.body.description,
     code_text: req.body.code
   }
   console.log(codeObject.question_testCases);
   SUBMISSION.push(codeObject);

   if(Math.floor(Math.random()))
   res.send("<h1 style='background-color: green;'>Solution Passed all testcases</h1>")
   else
   res.send("<h1 style='background-color: red;'>Solution failed</h1>")

   

 
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.


app.listen(port, ()=> {
  console.log(`Example app listening on port ${port}`)
})
