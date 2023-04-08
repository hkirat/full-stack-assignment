const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Manthan6296:Mkp-6296@cluster0.yysjuox.mongodb.net/Registration_DB"
  )
  .then(function () {
    console.log("Successfully connected to MongoDB-Atlas");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB-Atlas" + err);
  });

