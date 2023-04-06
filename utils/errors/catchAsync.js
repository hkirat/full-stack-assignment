const catchAsync= (func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch(e=> next(e))
    }
}

module.exports=catchAsync;