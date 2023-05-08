const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const port = 3001
const cors = require("cors")
const userRoute = require('./routes/users')
const questionRoute = require('./routes/question')
const submissionRoute = require('./routes/submission');

dotenv.config();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/users', userRoute)
app.use('/questions', questionRoute)
app.use('/submission', submissionRoute);

const db_username = process.env.DATABASE_EMAIL
const db_password = process.env.DATABASE_PASSWORD

const uri = `mongodb+srv://${db_username}:${db_password}@cluster0.answasc.mongodb.net/?retryWrites=true&w=majority`;

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