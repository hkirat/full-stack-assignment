
const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");




const userSchema= new mongoose.Schema({
   
    isAdmin:{
        type:Boolean,
        required:false,
        default:false,
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid");
            }
        }
    },
    
    password:{
        type:String,
        required: true,
        trim:true,
        validate(value){
            if(value.length<=6){
                throw new Error("Password should be greater than 6 character");
            }
            else if(((value.toLowerCase()).includes("password"))){
                throw new Error("Password should not include 'pasword in it'");
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    
  

},{
    timestamps:true
})


//creating instance method
userSchema.methods.genAuthToken=async function(){
    const user=this;
    const token= jwt.sign({id:user.id.toString()},"hello",{expiresIn:"1 day"})
    user.tokens.push({token});
    await user.save();
    
    return token;
}



//creating model method
userSchema.statics.findByCred= async function(email,rawPass){
    const user= await User.findOne({email})
    if(!user){ throw new Error("No user found")}

    const isMatch = await bcrypt.compare(rawPass,user.password);
    if(!isMatch){ throw new Error("Wrong password")}
    return user;
}




userSchema.pre('save',async function(next){
    const user=this;
    // note user.isModified check if the user's previous is same to new... no async 
    if(user.isModified("password")){
        
        user.password=await bcrypt.hash(user.password,8)
     
    }
    next();
})




// method two to acheive the same goal
userSchema.methods.toJSON= function (){
    const user=this;
    const userObj=user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;
    return userObj;
}


const User= new mongoose.model("User",userSchema);

module.exports=User;





