const express = require("express");
const app = express();
const port = 3001;
// initializing middleware to get req.body
app.use(express.json());

const USERS = [];
const ADMIN = 
  {
    email:"admin@gmail.com",
    password : 1234
  }
  
  let adminlogedin = false
  
 


const QUESTIONS = [
  {
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  const { email, password } = req.body;
  if (email && password) {
    let existuser = USERS.some((e) => e.email === email);
    if (existuser) {
      res.status(406).json({ status: false, msg: "email already exists" });
    } else {
      USERS.push(req.body);
      res.status(200).json({ status: true, msg: "user sucessfully added" });
    }
  } else {
    res
      .status(404)
      .json({ status: false, msg: "email and password not accepted" });
  }
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  if (email && password) {
    let existuser = USERS.find((e) => e.email === email);
    //console.log(existuser)
    if (existuser) {
      if (existuser.password === password) {
        res.status(200).json({ status: true, msg: "userloged in sucessfully" });
      } else {
        res.status(401).json({ status: false, msg: "invalid credentials" });
      }
    } else {
      res.status(404).json({ status: false, msg: "user not found" });
    }
  } else {
    res
      .status(404)
      .json({ status: false, msg: "email and password not accepted'" });
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ status: true, questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  res.status(200).json({status:true,SUBMISSION})
  
});

app.post("/submissions", function (req, res) {
  const {id,answer} = req.body;
  const isacepted = Math.random() >= 0.5
  if(id && answer){
    const subobj = {
      id,
      answer,
      isacepted
    }
    SUBMISSION.push(subobj)
    res.status(201).json({status:true,msg:'answer submited'})
  }
  else{
    res.status(404).json({status:false,msg:"answer cannote submit"})
  }
});

app.post("/adminlogin", function (req, res) {
  const { email, password } = req.body;
  if (email && password) {
    let isadmin = ADMIN.email === email
    //console.log(existuser)
    if (isadmin) {
      if (ADMIN.password === password) {
        adminlogedin = true
        res.status(200).json({ status: true, msg: "adminloged in sucessfully" });
      } else {
        res.status(401).json({ status: false, msg: "invalid credentials" });
      }
    } else {
      res.status(404).json({ status: false, msg: "admin not found" });
    }
  } else {
    res
      .status(404)
      .json({ status: false, msg: "email and password not accepted'" });
  }
});
app.post('/addquestion',(req,res)=>{
  if(adminlogedin){
  const {id,title,description,testCases} = req.body
  if(id && title && description && testCases.length){
    QUESTIONS.push(req.body)
    res.status(201).json({status:true,msg:"question is added"})
  }
  else{
    res.status(404).json({status:false,msg:"all fields are required"})
  }
}
else{
  res.status(404).json({status:false,msg:"admin not found"})
}

  
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
