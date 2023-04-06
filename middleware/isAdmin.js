
module.exports.isAdmin = async(req,res,next)=>{
    if(!req.user.isAdmin===true){
        console.log("You are not authorized")
        return res.send("You are not an Admin");
    }
    next();
}