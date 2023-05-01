const express = require('express')
const ejs = require('ejs');
const router = express.Router();
const {addUser} = require('./utils')


router.get('/signup', function (req, res) {
  // Render the form HTML
  res.send(`
    <html>
      <head>
        <title>Signup</title>
      </head>
      <body>
        <form method="post" action="/signup">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email"><br>
          <label for="password">Password:</label>
          <input type="text" id="password" name="password"><br>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

router.post('/signup', function (req, res) {
    const password = req.body.password;
    const email = req.body.email;
  
    // Render the HTML page using EJS
    const html = ejs.render(`
      <html>
        <head>
          <title>Signup confirmation</title>
        </head>
        <body>
          <h1>Thank You for Signing up!</h1>
          <p>Email: <%= email %></p>
        </body>
      </html>
    `, { email: email });
    
    const user = {
    
      email: email,
      password: password
    };
    addUser(user);
   
  
    res.send(html);
  })
  
  

  module.exports=router;