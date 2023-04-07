const express = require('express');
const app = express();
const port = 8000;
app.set(express.json())

app.use(express.urlencoded({extended:false}))

let Admin = {email: 'admin123@gamil.com' , password: 'admin'}

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}

];


const SUBMISSION = [



]

app.post('/signup', function(req, res) {

  const {email,password} = req.body;
  for (let i = 0; i < array.length; i++) {
    if(email = array[i].Email){
      res.status(409).send("The Email already exists");
      return;
    }
  }
  USERS.push({Email:email , Password:password})
  res.status(200).send('You have been sucessfully registered');
  res.end();
})

app.post('/login', function(req, res) {

  const{email,password} = req.body

  for (let index = 0; index < array.length; index++) {
    if (email == USERS[i].Email && password==USERS[i].Password) {
        res.status(200).send("Successfully logged in")
    }
    else{
      res.status(401).send("Your credentials doesnt match , please sign up or recheck your credentials")
    }
    
  }

  res.end()


})

app.get('/questions', function(req, res) {
let finaltext=""
let info = ""
if (QUESTIONS.length>0) {
  for (let i = 0; i < QUESTIONS.length; i++) {
    info = `${i+1}`+`Question: ${QUESTIONS[i].title}` + "<br>" +  `${QUESTIONS[i].description}` + "<br>"+  `input : ${QUESTIONS[i].testCases[0].input}` + "<br>" + `Output: ${QUESTIONS[i].testCases[0].output}`
    finaltext += info + '<br>'+'<br>'
   }
 
}

  res.send(finaltext)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   let finaltext=""
   let info = ""
   if (SUBMISSION.length>0) {
    for (let i = 0; i < SUBMISSION.length; i++) {
      info = `${i+1}`+`Question: ${SUBMISSION[i].Question}` + "<br>" +  `Solution : ${SUBMISSION[i].Solution}` + "<br>"+  `time : ${SUBMISSION[i].time}` + "<br>"  
      finaltext += info + '<br>'+'<br>'  //to add a good space between soltuions
     }
     res.status(200).send(finaltext)
     res.end()
   }else{
    res.status(404).end("There are no submission of solutions")
   }
   
    
});


app.post("/submissions", function(req, res) {
   const {probNO , Sol}  = req.body;
   random = Math.random()
   if (random>0.5) {
    SUBMISSION.push({Question :QUESTIONS[probNO-1], Solution: Sol , time: new Date().toLocaleDateString}); // -1 cuz the index of an array starts from 0
    res.end("your submission has been succesfully entered")
   }else{
    res.end('Your submission has been rejected')
   }

});

  app.post("/questions",(req ,res) =>{
   const {email,pass} = req.body

   

   if (email == Admin.email && pass == Admin.password) {
    var ques={
      title: "Two sub",
      description: "Given an array , return the manimum two sum of the array?",
      testCases: [{
          input: "[1,2,3,4,5]",
          output: "3"
      }]
    }
    QUESTIONS.push(ques);
    res.status(200).send("Question added")   }
   else{
    res.end("Only admin can add questions(Enter Valid creds)")

   }

  })


app.listen(port, function() {
  console.log(`app listening on port ${port}`)
})