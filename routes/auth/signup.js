const express = require('express');
const app = express();

app.post('/signup', function(req, res) {
    // Add logic to decode body
    // body should have email and password
  
  
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
  
    // return back 200 status code to the client
    res.sendStatus(200);
  })

  app.listen(3001, function() {
    console.log(`Example app listening on port ${3001}`);
  })