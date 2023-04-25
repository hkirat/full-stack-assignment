const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World! testing testing testing')
})


const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
  }]},
  {
  title: "Find Sum",
  description: "Given two integers , return the sum of the two numbers,",
  testCases: [{
      input: "1 2",
      output: "3"
  }]
  }
];

const SUBMISSIONS = [

]


const USERS = [
  {
    email : '123',
    password : '123'
  },
  {
    email : 'abc',
    password : 'abc'
  }
  
] 


app.post('/signup', (req,res) => {

    const data = req.body
    let flag = 1;
    for( let i of USERS){
        if(i.email == data.email){
            flag=0;
            break;
        }
    }

    if(flag == 1){
        USERS.push(data);
        res.status(200).send('Signup successful!')
    }
    else{
        res.status(401).send('User already exists')
    }
})

app.post('/login', (req, res) => {

    const data = req.body
    let flag=0
    for( let i of USERS){
        if( i.email == data.email){
            flag=1;
            if(i.password == data.password){
                flag=2
            }
            break
        }
    }

    if(flag == 2){
    res.status(200).json({token : "this_is_an _authorization_token"})
    
    }
    else if( flag==1){
    res.status().send(401)
    }
    else{
    res.status().send(401)
    }
 
})

app.get('/questions', (req, res) => {
  res.send(QUESTIONS)
})

app.post('/submit', (req, res) => {
  const data = req.body
  SUBMISSIONS.push({
    code : data.code,
    status : Math.floor(Math.random()*2) ? "Accepted!" : "Failed!"
  })
  res.send(SUBMISSIONS[SUBMISSIONS.length -1].status) 
})

app.get('/submissions', (req, res) => {
  res.send(SUBMISSIONS)
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})