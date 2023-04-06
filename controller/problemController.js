const Problem= require("../src/models/Problem")



//show all problems
module.exports.getAll=async (req,res)=>{
    const problems= await Problem.find({});
    res.send(problems);
}


//add new problem
module.exports.addProblem=async (req,res)=>{
    const problem = new Problem(req.body);
    problem.author= req.user._id;
    await problem.save();
    res.send(problem);
 
}


//editProblem
module.exports.editProblem=async (req,res)=>{
    let problem = await Problem.findById(req.params.id);
    problem.title= req.body.title;
    problem.description= req.body.description;
    // problem.testCases= req.body.testCases;
    problem=await Problem.findByIdAndUpdate(req.params.id,{ ...problem});
    console.log(problem);
    await problem.save()
    res.status(200).send(problem);
}



module.exports.showProblem=async (req,res)=>{
    const problem = await Problem.findById(req.params.id).populate(
        {  
            path:"submissions",
            populate:{
                path:"author",
            }
        }).populate("author");

    if(problem){
        res.send(problem);
    
    }else{
        res.status(404).send({"error":"No such problem exist"})
        console.log("No such problem exist")
      
    } 
}


//delete camp
module.exports.deleteProblem=async (req,res)=>{
    const problem =await Problem.findByIdAndDelete(req.params.id);
    res.send("Ok Deleted");
    
}
