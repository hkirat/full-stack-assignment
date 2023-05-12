const express = require('express');

const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
let token_id = 'null';

const USERS = [ { email: 'ramik.14062000@gmail.com',userId: '0', password: '12345' }
];
const ADMINS = [{email: 'admin@example.com', userId: 'admin', password: 'admin123'}];

const QUESTIONS = [
  { problemId: '0',
    title: 'Two states',
    description: 'Given an array, return the maximum of the array?',
    testCases: [
      {
        input: '[1,2,3,4,5]',
        output: '5'
      }
    ]
  },
  {problemId: '1',
  title: 'Two Gears',
  description: 'Given an array, return the maximum of the gears?',
  testCases: [
    {
      input: '[1,2,3,7,5]',
      output: '53'
    }
  ]
}
];

const SUBMISSIONS = [
  {
    userId : "0",
    problemId : "0",
    code: "something for two states",
    status: "accepted"
  },
  {
    userId : "1",
    problemId : "0",
    code: "something for two gears",
    status: "rejected"
  }
  // Add more sample submissions as needed
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*const tokenGeneration = (req, res, next) => {
  //generate token
  const token = jwt.sign({userId:req.body.userId, email: req.body.email, password: req.body.password}, 'RM181343811');
  res.json({ token: token });
  next();

}*/

/*const tokenVerification = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization.split(' ')[1];

  // Verify the token
  jwt.verify(token, 'RM181343811', (err, decoded) => {
    if (err) {
      res.status(401).send('Unauthorized');
    }
    else {
      // Add the decoded email to the request body
      req.body.email = decoded.email;
      next();
    }
  });
};*/


app.get('/signup', (req, res) => {
  res.send(`
    <form method="POST">
      <label>email</label>
      <div><input name="email"/></div>
      <label>userId</label>
      <div><input name="userId"/></div>
      <label>password</label>
      <div><input name="password" type="password"/></div>
      <div><button>Signup</button></div>
    </form>
  `);
});

const checkIfPresent = (req, res, next) => {
  if (USERS.find(user => user.email === req.body.email)) {
    res.send('Email ID is already present');
  }
  else{next();}
};

const checkIfMatching = (req, res, next) => {
  if (USERS.find(user => (user.userId === req.body.userId) && (user.password === req.body.password))) {
    if(req.body.userId==='0'){token_id = 'R7044377'
  res.send(token_id);}
  else if (req.body.userId==='1') {
    token_id='RM181343811'
    res.send(token_id);
  }
  else {
    res.send('cant sign in');
  }
    next();
  }
  else{res.send('Wrong email_id or password');
  res.status(401);}
};


app.post('/signup', checkIfPresent, (req, res) => {
 
  // Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)
  
  USERS.push({ email: req.body.email, userId: req.body.userId, password: req.body.password });
  if(req.body.userId==='0'){token_id = 'R7044377'
  res.send(token_id);}
  else if (req.body.userId==='1') {
    token_id='RM181343811'
    //console.log(token_id);
    res.send(token_id);;
  }
  else {
    res.send('Wrong email_id or password');
  }
  console.log(USERS);
});
const Ifadmin = (req, res, next) => {
  if (ADMINS.find(admin => (admin.userId === req.body.userId) && (admin.password === req.body.password))) {
    next();
  }
  else{res.send('Wrong email_id or password');
  res.status(401);}
}

app.get('/login', (req, res) =>{
  res.send(`
    <form method="POST">
      <label>userId</label>
      <div><input name="userId"/></div>
      <label>password</label>
      <div><input name="password" type="password"/></div>
      <div><button>login</button></div>
    </form>
  `);
});

app.get('/adminlogin', (req, res) =>{
  res.send(`
    <form method="POST">
      <label>userId</label>
      <div><input name="userId"/></div>
      <label>password</label>
      <div><input name="password" type="password"/></div>
      <div><button>login</button></div>
    </form>
  `);
});

app.post('/adminlogin',Ifadmin, (req, res) =>{
  token_id = 'admintoken'
  res.status(200).end('admin successfully logged in');
});

 app.post('/login', checkIfMatching, (req, res)=> {
  // Add logic to decode body
  
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  res.status(200).send('User successfully logged in');
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', (req, res)=> {
  // Get the QUESTIONS array
  const questions = QUESTIONS;

  // Generate the HTML response with the embedded JSON data
  //create html response with submissions button for every question with ProblemId as request body
  const htmlResponse = `
    <html>
      <body>
        <h1>Questions</h1>
        <ul>
          ${questions.map((question) => `
            <li>
              <h2>${question.title}</h2>
              <p>${question.description}</p>
              <form method="POST" action="/questions">
                <input type="hidden" name="problemId" value="${question.problemId}"/>
                <button>Submissions</button>
              </form>
            </li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;
  // Send the HTML response
  res.send(htmlResponse);
});


app.post('/questions', function(req, res) {
  // Get the problemId from the request body
  const problemId = req.body.problemId;
  //console.log(problemId);
  //pass the problemId to the submissions route as a query parameter
  res.redirect(`/submissions?problemId=${problemId}`);
})
const verifyToken = (req, res, next) => {
   if(token_id==='R7044377'){
    req.body.userId = '0';
    next();}
  else if(token_id==='RM181343811'){
    req.body.userId = '1';
    next();
  }
  else{
      res.send('Unauthorized');
    }
}



app.get("/submissions",verifyToken, function(req, res) {
    const loggedInUserId = req.body.userId; // Assuming the userId is available in the request body
    console.log(loggedInUserId);
  // Filter the submissions based on the logged-in user's email
  const filteredSubmissions = SUBMISSIONS.filter((submission) => submission.userId === loggedInUserId && submission.problemId===req.query.problemId);
res.json(filteredSubmissions);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.get('/problems', function(req, res) {
  if(token_id==='admintoken'){
  // Generate the HTML response with the embedded JSON data
  const htmlResponse = `
    <html>
      <body>
        <h1>Add a new problem</h1>
        <form method="POST" action="/problems">
          <div>
            <label>Title</label>
            <input name="title"/>
          </div>
          <div>
            <label>Description</label>
            <textarea name="description"></textarea>
          </div>
          <div>
            <label>Input</label>
            <textarea name="input"></textarea>
          </div>
          <div>
            <label>Output</label>
            <textarea name="output"></textarea>
          </div>
          <button>Add</button>
        </form>
      </body>
    </html>
  `;
  // Send the HTML response
  res.send(htmlResponse);}
  else{
    res.send('Unauthorized');
  }
});
app.post('/problems', function(req, res) {
  // Get the title and description from the request body
  if(token_id==='admintoken'){
  const title = req.body.title;
  const description = req.body.description;
  const testCases = [{input: req.body.input, output: req.body.output}];
  // Generate a problemId
  const problemId = QUESTIONS.length;
  // Add the problem to the PROBLEMS array
  QUESTIONS.push({ title: title, description: description, testcases: testCases, problemId: problemId });
  // Redirect to the /questions route
  res.status(200).redirect('/questions');}
  else{
    res.send('Unauthorized');
  }
})
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})