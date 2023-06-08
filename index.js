const express = require('express')
const app = express()
const port = 3001

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

const random_token = (length) => {
  const result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const characters_length = characters.length
  let counter = 0
  while(counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters_length))
    counter += 1
  }

  return result

}
app.post('/signup', function(req, res) {
  // Add logic to decode body
  console.log('URL - ', req.url, ' called at ', new Date())
  try {
    const {email, password} = req.body
    const found = USERS.find(user => user.email === email)
    if(!found){
      USERS.push({'email': email, 'password': password})
      res.status(200).send('Success')
    } else {
      res.send('User Already Exists')
    }
  } catch (err) {
    console.log(err)
  }
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  console.log('URL - ', req.url, ' called at ', new Date())

  try {
    const {email, password} = req.body
    const found = USERS.find(user => user.email === email)
    if(found) {
      if(password === found['password']) {
        res.status(200).send({'status': 'Success', 'token': random_token(20)})
      } else {
        res.status(401).send('Incorrect Password')
      }
    } else {
      res.status(401).send('User Already Exists')
    }

  } catch(err) {
    console.log(err)
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  console.log('URL - ', req.url, ' called at ', new Date())
  try {
    res.status(200).send(QUESTIONS)
 
  } catch(err) {
    console.log(err)
  }
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  console.log('URL - ', req.url, ' called at ', new Date())
  try {

    res.send(200).send(SUBMISSION)
  } catch (err) {
    console.log(err)
  }
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  console.log(' URL - ', req.url, ' called at ', new Date())
  try {
    const {email, answer} = req.body
    if(answer.length % 2 === 0) {
      SUBMISSION.push({'email': email, 'Submission': answer})
      res.status(200).send('success')
    } else {
      res.send('Incorrect Code')
    }


  } catch(err) {
    console.log(err)
  }
});

app.post("/questions", function(req, res) {

  console.log('URL - ', req.url, ' called at ', new Date())
  try {
    const {email, question} = req.body
    const found = USERS.find(user => user.email === email)
    if(found['role'] === 'admin' ) {
      QUESTIONS.push(question)
      res.status(200).send('success')
    } else {
      res.status(401).send("User Doesn't have the access")
    }

  } catch (err) {
    console.log(err)
  }
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
