const express = require("express")
const app= express();
const cors= require("cors")
const pool = require("./db")
app.use(cors());
app.use(express.json())
// get all leaves
app.get("/leaves", async (req, res)=>{
  try {
    const allleaves= await pool.query("SELECT * FROM stdleaves");

    res.json(allleaves.rows);
  } catch (err) {
    console.log(err.messgae)
    
  }
})
//get a leave
app.get("/leaves/:id", async (req, res)=>{
  try {
    const {id}= req.params;
    const data= await pool.query(" SELECT * FROM stdleaves WHERE leave_id = $1", [id]);

    res.json(data.rows);
  } catch (err) {
    console.log(err.messgae)
    
  }
})
//enter the leave 
app.post("/leaves", async (req,res)=>{
  try {
    const { stdname,regNum,leaveType,visitingPlace,reason,fromDate,toDate }= req.body;
    const newleave = await pool.query("INSERT INTO stdleaves (stdname,regNum,leaveType,visitingPlace,reason,fromDate,toDate) VALUES ($1, $2,$3,$4,$5,$6,$7) RETURNING *", [stdname,regNum,leaveType,visitingPlace,reason,fromDate,toDate]);
    res.json(newleave.rows[0]);
  } catch (err) {
    console.log(err.messgae)
    
  }
})

// upadate a leave_status
app.put("/leaves/:id", async(req, res)=>{
  try {
    const {id}= req.params;
    const {status} = req.body;
    const updatestatus= await pool.query("UPDATE stdleaves SET status = $1 WHERE leave_id = $2",[status, id]);
    res.json(updatestatus.rows);
  } catch (err) {
    console.log(err.messgae);
  }

})

//get the no of entries per regestration num[
  app.get("/leave", async (req, res)=>{
    try {
      const {regnum}= req.body;
      const count= await pool.query("SELECT COUNT(*) as count FROM stdleaves WHERE regnum = $1",[regnum]);
  
      res.json(count.rowCount)
    } catch (err) {
      console.log(err.messgae)
      
    }
})

// delete a leave_application

app.delete("/leaves/:id", async (req, res)=>{
  try {
    const {id}= req.params;
    const deleteleave = await pool.query("DELETE FROM stdleaves WHERE leave_id=$1", [id]);
    res.json("row deleted");
  } catch (err) {
    console.log(err.messgae)
    
  }
})


app.listen(500, ()=>{
  console.log("server is started runing");
})