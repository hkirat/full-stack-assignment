const express = require('express')
const { use } = require('express/lib/application');
const app = express()
const port = 3000

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const USERS = [{ username: "abc", password: 1234 }];
const ADMIN = [{ username: "admin", password: 1234 }];


const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = [{ username: "abc", submissions: [] }]


app.get('/', (req, res) => {
  res.send(`
  <h1>Welcome to codevilla<h1/>
  <a href="/login">Login</a><br>
  <a href="/signup">SignUp</a>
  `);
})

//--------------------Signup--------------------------//
//logic for user registration request
app.get('/signup', (req, res) => {
  res.send(`
  <form action="/signup" method="post">
      <label>User Name</label><br>
      <input type="text" id="username" name="username"><br>
      <label>New Password</label><br>
      <input type="text" id="password" name="password"><br>
      <button type="submit">Submit</button>
  <form/>`);
})

app.post('/signup', (req, res) => {
  let username = req.body.username;
  let password = Number(req.body.password);
  let check = USERS.find(({ username: user }) => { return user === username })
  if (!check) {
    USERS.push({ username: username, password: password });
    res.redirect('/login')
    console.log(user)
  }
  else {
    // res.status(400).json({ error: "username already taken" })
    res.send("Username taken")
    // res.redirect('/signup')
  }
})


//--------------------Login--------------------------//
//logic for user login request
app.get('/login', (req, res) => {
  res.send(`
  <form action="/login" method="post">
  <label>Username</label><br>
  <input type="text" id="username" name="username"><br>
  <label>password</label><br>
  <input type="text" id="password" name="password"><br>
  <button type="submit">Submit</button>
  </form>`)
})
app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = Number(req.body.password);
  console.log(typeof username);
  console.log(typeof password);
  let check = USERS.find(data => data.username === username);

  if (check && check.password === password) {
    res.redirect(`/questions?username=${username}`);
  } else {
    res.status(401).send("Not Authorized");
  }
})


//--------------------Qusetions--------------------------//
//logic for giving the user random Q in available questions
app.get('/questions', (req, res) => {
  let question_num = Math.floor(Math.random() * QUESTIONS.length)
  console.log(question_num)
  if (QUESTIONS.length != 0) {
    let username = req.query.username;
    let title = QUESTIONS[question_num].title;
    let description = QUESTIONS[question_num].description;
    let testcases = QUESTIONS[question_num].testCases;

    //to send json string
    // res.write(questionsString);

    //to send html
    // res.write(htmlContent);

    //to end response
    // res.end();

    res.status(200).send(`
      <div>Username : ${username}</div>
      <form action='/submissions?username=${username}' method="post">
          <ul>
          <li>${title}</li>
          <li>${description}</li>
          <li>input : ${testcases[0].input}</li>
          <li>output : ${testcases[0].output}</li>
          </ul>
          <input id="code" name="code">
          <button type="submit">submit</button>
      </form>
      `)
  } else {
    res.send("No questions available")
  }
})


app.post('/questions', (req, res) => {
  let title = req.body.title
  let description = req.body.description
  let input = req.body.input
  let output = req.body.output

  QUESTIONS.push({ title: title, description: description, testCases: [{ input: input, output: output }] })
  res.redirect('/login')
})

//--------------------Submissions--------------------------//
//logic to let user make submissions
app.post('/submissions', (req, res) => {
  let username = req.query.username;
  console.log("username", username)
  let code = req.body.code;
  if (code === code.toLowerCase()) {
    let user_index = SUBMISSION.findIndex(user => user.username === username);
    SUBMISSION[user_index].submissions.push(code)
    console.log(user_index)
    console.log(SUBMISSION[user_index].submissions[0])
    res.redirect(`/submissions?userindex=${user_index}`)
  } else {
    res.send(`
      <div>not even close</div>
      `)
  }
})

//logic to show the user submissions
app.get('/submissions', (req, res) => {
  user_index = req.query.userindex
  res.send(`
  <div>Your submissions are</div>
  <div>${SUBMISSION[user_index].submissions}</div>
  `)
})





//--------------------admin--------------------------//
//login for admin page
app.get('/admin', (req, res) => {
  res.send(`
  <form action="/admin" method="post">
  <label>admin Username</label><br>
  <input type="text" name="username"><br>
  <label>Password</label><br>
  <input type="text" name="password"><br>
  <button type="submit">Submit</button>
  </form>
  `)
})


//add question for admin
app.post('/admin', (req, res) => {

  let adminUser = req.body.username;
  let adminPassword = Number(req.body.password);
  let check = ADMIN.find(({ username: user }) => { return user === adminUser })
  if (check && check.password === adminPassword) {
    res.send(`
  <form action="/questions" method="post">
  <label>Question</label><br>
  <input type="text" name="title"><br>
  <label>Description</label><br>
  <input type="text" name="description"><br>
  <label>Testcases:</label><br>
  <label>Input</label><br>
  <input type="text" name="input"></input><br>
  <label>Output</label><br>
  <input type="text" name="output"></input><br>
  <button type="submit">Submit</button>
  </form>
  `)
  } else {
    res.status(401).send("Not Authorized")
  }
})

// app.
//-----------------server confirmation------------------------//

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
