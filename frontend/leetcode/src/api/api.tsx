import axios from 'axios'
import { error } from 'console'

const instance = axios.create({
    baseURL:"http://localhost:3001"
}) 
 const baseurl = "http://localhost:3001"
interface signupdata {
    email:string|undefined,
    password:string|undefined
}


export const signup = async({email,password}: signupdata) =>{
    try{
        console.log(password+'is comming')
         const response = await instance.post("/signup",{email,password});
        // const response = await axios.post("http://localhost:3001/signup", { email, password });
        console.log("jef");
        return response.data;
    }
    catch (error){
        console.log(error)
     throw error;
    }
     

}
export const login = async({email,password}:signupdata)=>{
    try{
         const response = await instance.post("/login",{email,password});
        return response.data;
    }
    catch (error){
        console.log(error)
     throw error;
    }
       
}

export const questions = async()=>{
try {
const response =  await instance.get("/questions");
// console.log(response);
return response.data
}
catch(error){
console.log(error);
throw error;
}
}