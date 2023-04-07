const express = require('express')
const app = express()
const port = 3001

app.use(express.urlencoded({extended:false})) //helps to decode body
const USERS = [];

const Admins=[
  {
    email: "rohan@gmail.com",
    password: "12345"
  }
]

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
  
app.post('/signup', function(req, res) {
  var tempemail=req.body["email"];
  var temppass=(req.body["password"]);

  var tempuser={ email: tempemail,password:temppass};
  for (let i=0;i<USERS.length;i++) 
  {
    if(USERS[i].email===tempemail) 
    {
      res.status(409).send("User already registered");
      return;
    }
  }   
  USERS.push(tempuser);
  res.status(200).send(`account created successfully`);
})
  
app.post('/login', function(req, res) 
{
  var tempemail=req.body["email"];
  var temppass=req.body["password"];
  for (let i=0;i<USERS.length;i++) {
    if(USERS[i].email===tempemail && USERS[i].password===temppass) {
      res.setHeader("Authorisation",`${tempemail+"00"}`);
      res.status(200).send(`login successful`);
      return;
    }
  }

  res.status(401).send("login credentials are invalid");
})

app.get('/questions', function(req, res) {
  var text=``;
  var count=1;
  for(let i=0;i<QUESTIONS.length;i++){
    var temp=QUESTIONS[i];
    text+=`Ques.${count++}-  Title: ${temp.title}
Description: ${temp.description}
Testcases: `;
    var test="";
    for(let j=0;j<temp.testCases.length;j++){
      var obj=temp.testCases[j];
      test+=`\n-> Input: ${obj.input}
   Outupt: ${obj.output}`
    }
    text+=test+"\n\n";

  }
  console.log(text);
  res.status(200).send(text)
})

app.get("/submissions", function(req, res) 
{
  var str="";
  var temp=1;
  for(let i=0;i<SUBMISSION.length;i++){
    str+=`Submission ${temp++}: ${SUBMISSION[i].check?'accepted':'rejected'}, Time: ${SUBMISSION[i].time}\n`
  }
  res.status(200).send(str);
});


app.post("/submissions", function(req, res) {
  var { prob, sol } = req.body;
  var check = Math.random() < 0.5;
  
  var submission = { prob, sol, check ,time:new Date().toLocaleString()};
  SUBMISSION.push(submission);
  res.status(200).send(`your solution is ${check?'accepted':'rejected'}`);
});


app.post("/admin", (req,res)=>{
  var tempemail=req.body["email"];
  var temppass=req.body["password"];
  var x=Admins.find( (item)=>{
    return item.email===tempemail && item.password===temppass;
  } );
  if(x==undefined){
    res.status(401).send(`invalid credentials`);
    return;
  }
  var ques={
    title: "Two sum",
    description: "Given an array , return the maximum two sum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "9"
    }]
  }
  QUESTIONS.push(ques);

  res.status(200).send(`question added successfully`);
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})