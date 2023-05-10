const express = required("express")
const app = express()
const PORT = 3000;

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port${PORT}`);
})

