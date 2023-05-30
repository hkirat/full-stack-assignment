const express = require('express');
const app = express();


app.get('/questions', function(req, res) {

    //return the user all the questions in the QUESTIONS array
    res.send("Hello World from route 3!")
  })
  