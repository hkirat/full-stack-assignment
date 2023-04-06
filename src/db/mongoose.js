const mongoose=require("mongoose");

//mongoose

const dbName="Harkirat-fs-demo";

mongoose.connect("mongodb://127.0.0.1:27017/"+dbName,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection open");
})
.catch(err=>{
    console.log(err);
 
})
