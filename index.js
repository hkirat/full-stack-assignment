const express = require('express')
const bodyParser = require('body-parser');


const app = express()
const port = 3001
const path = require('path');
const bcrypt = require('bcrypt');
const usersDB = {
   // //alternate way
   users: require(path.join(__dirname, 'model', 'users.json')),
   setUsers: function (data) {
      this.users = data
   }

};

const fsPromises = require('fs').promises;
app.use(express.json())
app.use(bodyParser.urlencoded({
   extended: true
}))
// app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.get('/style.css', function (req, res) {
   res.setHeader('Content-Type', 'text/css');
   res.sendFile(path.join(__dirname, 'public', 'style.css'));
});
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// const USERS = [];

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

app.get('/', function (req, res) {

   res.send('Hello ')
})

app.get('/signup', (req, res) => {
   res.render('signup');
});

// app.get('/signup', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views','signup.html'))
// });

app.post('/signup', async (req, res) => {
   const {
      username,
      password
   } = req.body;
   if (!username || !password) return res.status(400).json({
      'message': 'Username and password are required.'
   })
   // console.log(USERS);
   const userCheck = usersDB.users.find(user => user.username === username);
   if (userCheck) {
      return res.status(409).render('signup', {
         error: 'User already exists'
      });
   } else {
const hashedPwd = await bcrypt.hash(password,10);
      // alternate way
      // store the new user
      const newUser = {
         "username": username,

         "password": hashedPwd
      };
      usersDB.setUsers([...usersDB.users, newUser]);
      await fsPromises.writeFile(
         path.join(__dirname, 'model', 'users.json'),
         JSON.stringify(usersDB.users)
      );


      res.status(201).json({
         'success': `New user ${username} created!`
      })

   }

})

app.get('/login', (req, res) => {
   res.render('login');
});

app.post('/login', async (req, res) => {

   const {
      user,
      pwd 
   } = req.body;
   if (!user || !pwd) return res.status(400).json({
      'message': 'Username and password are required.'
   })
   const foundUser = usersDB.users.find(person => person.username === user);
   if (!foundUser) return res.sendStatus(401);
   const match = await bcrypt.compare(pwd, foundUser.password)
   if (match) {
      res.json({
         'success': `User ${user} is logged in`
      });
   } else {
      res.sendStatus(401);
   }

   // Add logic to decode body
   // body should have email and password

   // Check if the user with the given email exists in the USERS array
   // Also ensure that the password is the same


   // If the password is the same, return back 200 status code to the client
   // Also send back a token (any random string will do for now)
   // If the password is not the same, return back 401 status code to the client


   
})

app.get('/questions', function (req, res) {

   //return the user all the questions in the QUESTIONS array
   res.send("Hello World from route 3!")
})

app.get("/submissions", function (req, res) {
   // return the users submissions for this problem
   res.send("Hello World from route 4!")
});


app.post("/submissions", function (req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
   console.log(`Example app listening on port ${port}`)
})