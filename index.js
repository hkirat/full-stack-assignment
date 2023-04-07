const express = require('express')
const app = express();
app.use(express.json());
const port = 3001
let TOKEN = "";
let USERS = [];

let QUESTIONS = [{
    "id":1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


let SUBMISSION = [

]
function lack_of_token(res){
  res.status(401).json({"message":"Invalid token provided"});
}
app.post('/signup', function (req, res) {
    const {email,password, admin} = req.body;
    !email || !password && res.status(401).json({"message":"Insufficient credentials provided!"});
    USERS.find(user=>user.email === email) && res.status(403).json({"message":"This user already exists!"});
    USERS.push({email,password,admin});


  res.status(200).json({"message":"User signed up successfully!"});
})

app.post('/login', function(req, res) {

  const {email,password} = req.body;
  !email || !password && res.status(403).send("Email or password not provided!");
  let req_user = USERS.find(user=>user.email === email);
  if(!req_user){
    return res.status(403).json({
      "message":"User not registered"
    });
  }
  else if(req_user.password !== password){
    res.status(401).json({"message":"Wrong Credentials"});
  }
  TOKEN= Math.floor(Math.random()*1000).toString();

  res.status(200).json({"message":"Authentication Successful", "token": TOKEN})


})

app.get('/questions', function (req, res) {
  res.status(200).json({"questions":QUESTIONS});
})

app.get("/submissions", function(req, res) {

  const {qid} = req.body;
  const submission = SUBMISSION.filter(item=>item.qid === qid);
  submission ? res.status(200).json({"submission":submission}) : res.status(404).json({"message":"Question doesn't exist/ No submission found for this question"});


});


app.post("/submissions", function(req, res) {

  const {qid,submission,email , token} = req.body;
  !(token === TOKEN) && lack_of_token(res);
  !submission && res.status(403).json({"message":"No submission provided"});

  const result = Boolean(Math.floor(Math.random() * (2)));
  SUBMISSION.push({"qid":qid,"submission":submission, "email":email});
  res.status(200).json({"message": result? "Answer is correct":"Answer is wrong"});
});


app.post("/addquestion", function(req,res){
  const {email, id, title, description, testCases, token} = req.body;
  !(token === TOKEN) && lack_of_token(res);
  const user = USERS.find(user=>user.email === email);
  if(user){
    if(user.admin){
      QUESTIONS.push({
        "id":QUESTIONS.length+1,
        title: title,
        description: description,
        testCases: testCases
    })
      res.status(200).json({
        "message":"Question Successfully submitted"
      });
    }
    else{
      res.status(403).json({"message":"You are not authorized to add questions as you are not admin"})
    }
  }

});



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})