const express = require('express');
const app = express();


app.post('/login', function(req, res) {
    // Add logic to decode body
    // body should have email and password

    const {email,password} = req.body;
  
    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same

    const userExits = USERS.some(user => user.email === email);
  
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
  
  
    res.send('Hello World from route 2!')
  })