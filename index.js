const express = require('express')
const app = express()
const port = 3001
const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

const questions = [
    {
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "5"
        }]
    },
    {
      title: "Maximum element",
      description: "Given an array of integers, return the maximum element.",
      testCases: [
        {
          input: "[1,2,3,4,5]",
          output: "5"
        },
        {
          input: "[10,-2,8,7,1]",
          output: "10"
        },
        {
          input: "[-1,-2,-3,-4,-5]",
          output: "-1"
        }
      ]
    },
    {
      title: "Minimum element",
      description: "Given an array of integers, return the minimum element.",
      testCases: [
        {
          input: "[1,2,3,4,5]",
          output: "1"
        },
        {
          input: "[10,-2,8,7,1]",
          output: "-2"
        },
        {
          input: "[-1,-2,-3,-4,-5]",
          output: "-5"
        }
      ]
    },
    {
      title: "Sum of elements",
      description: "Given an array of integers, return the sum of all the elements.",
      testCases: [
        {
          input: "[1,2,3,4,5]",
          output: "15"
        },
        {
          input: "[10,-2,8,7,1]",
          output: "24"
        },
        {
          input: "[-1,-2,-3,-4,-5]",
          output: "-15"
        }
      ]
    },
    {
      title: "Average of elements",
      description: "Given an array of integers, return the average of all the elements.",
      testCases: [
        {
          input: "[1,2,3,4,5]",
          output: "3"
        },
        {
          input: "[10,-2,8,7,1]",
          output: "4.8"
        },
        {
          input: "[-1,-2,-3,-4,-5]",
          output: "-3"
        }
      ]
    },
    {
      title: "Count of elements",
      description: "Given an array of integers, return the count of all the elements.",
      testCases: [
        {
          input: "[1,2,3,4,5]",
          output: "5"
        },
        {
          input: "[10,-2,8,7,1]",
          output: "5"
        },
        {
          input: "[-1,-2,-3,-4,-5]",
          output: "5"
        }
      ]
    },
    {
      title: "Reverse array",
      description: "Given an array of integers, return the array in reverse order.",
      testCases: [
        {
          input: "[1,2,3,4,5]",
          output: "[5,4,3,2,1]"
        },
        {
          input: "[10,-2,8,7,1]",
          output: "[1,7,8,-2,10]"
        },
        {
          input: "[-1,-2,-3,-4,-5]",
          output: "[-5,-4,-3,-2,-1]"
        }
      ]
    }
  ];
  


const SUBMISSION = [

]
const USERS = [];

app.get('/signup', function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if(email!=USERS.map(user=>user.email)){
        USERS.push({ email, password });
        console.log(USERS);
        res.redirect("/login");
    }
    else{
        res.sendFile(__dirname + "/userAlreadyExists.html");
    }
  });

app.get('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  

  res.sendFile(__dirname+"/login.html");
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (user) {
    res.redirect('/questions');
  } else {
    res.redirect('/login');
    res.send("<script>alert('Username or password do not match.');</script>");
  }
});


app.get('/questions', (req, res) => {
    //return the user all the questions in the QUESTIONS array
  res.render(__dirname +'/questions', { questions });
});

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.sendFile(__dirname+"/submissions.html");
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const submission = req.body.submission;
   SUBMISSION.push(submission);
  res.redirect('/results');
});

app.get('/results', (req, res) => {
  const result = Math.random() < 0.5 ? 'Incorrect Answer' : 'Correct Answer';
  res.render(__dirname +'/results', { result });
});

app.get('/view-submissions', (req, res) => {
  res.render(__dirname +'/view-submisions.ejs', {  submissions: SUBMISSION  });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})