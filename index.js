const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3001
const cors = require("cors")
const userRoute = require('./routes/users')
const questionRoute = require('./routes/question')
const uri = "mongodb+srv://athukarad109:ihatemobilegames@cluster0.answasc.mongodb.net/?retryWrites=true&w=majority";


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/users', userRoute)
app.use('/questions', questionRoute)

const connectToDB = async() => {
  try{
    await mongoose.connect(uri);
    console.log("Connected to db");
  }catch(err){
    console.log(err)
  }
}

connectToDB();

app.listen(port, function() {
  console.log(`App listening on port ${port}`)
})