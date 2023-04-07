const express = require('express')
const app = express()
const port = 3003

const USERS = [];
const SUBMISSION = [
app.post('/signup', function(req, res) {
    
    //checking for email and password
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).send('Email and Password both are required');
    }

    
    //checking if the user exists or not
    const userExists = USERS.some(user => user.email === email);
    if(userExists){
        return res.status(409).send('User Already Exists');
    }
    
    
    const newUser = { email, password };
    USERS.push(newUser);

  // return back 200 status code to the client for adding in the user
  res.send('Hello World!')
    res.status(200).send('User Created Succesfully');
})

app.post('/login', function(req, res) {

    const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
    const user = USERS.find(user => user.email = email);
    if(!user){
        return res.status(401).send('Inavlid User Email');
    }
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
    if(user.password === password){
        const token = 'randomToken';
        return res.status(200).send({ token });
    }

  // If the password is not the same, return back 401 status code to the client
    else{
        return res.status(401).send('Invalid Password');
    }


  res.status(200).send('Successfully Logged In')
//   res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

    res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
    const { email } = req.query;
    if(!email){
        return res.status(400).send('Email is required');
    }

    const sub = SUBMISSION.filter(submission => submission.email === email);
    res.status(200).send(sub);
});


app.post("/submissions", function(req, res) {
    
   const { email, questionTitle, code } = req.body;

   if(!email || !questionTitle || !code){
        return res.status(400).send('Invalid inputs');
   }

   const question = QUESTIONS.find(question => question.title === questionTitle);
   if(!question){
        return res.status(!404).send('Question not found');
   }

   const isCorrect = Math.round(Math.random()) == 1;
   const submission = { email, questionTitle, code, isCorrect };
   SUBMISSION.push(submission);

   res.status(200).send({ isCorrect });
});

app.post("/addque", function(req, res){
    const { title, description, testCases } = req.body;

     const isAdmin = req.headers.authorization == 'ADMIN'; // checking if the user is an admin by using checking the tokens. Some random token here for now

    if(!isAdmin){
        return res.status(401).send("Unauthorized access!");
    }

    const newQuestion = { title, description, testCases };
    QUESTIONS.push(newQuestion);

    res.status(200).send('Question Added');

})



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
})
