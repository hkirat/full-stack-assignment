import React ,{useState} from 'react'
import { signup } from '../api/api';
const Signup : React.FC=()=> {
    const [email,setemail] = useState<string|undefined>();
    const [password,setpassword] = useState<string|undefined>();
    const [reenterpass, setrepassword] = useState<string|undefined>();
    const handleChange =(e: React.ChangeEvent<HTMLInputElement>)=>{
        setemail(e.target.value)
   
    }
    const handlePassword =(e: React.ChangeEvent<HTMLInputElement>)=>{
   setpassword(e.target.value);
    }
    const handleSubmit =(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(reenterpass==password){
            signup({email,password});
            setpassword('');
      setemail('');
      setrepassword('');
        }
        else{
            alert('password did not match');
        }
             
    }
    const typepasswordagain=(e: React.ChangeEvent<HTMLInputElement>)=>{
        setrepassword(e.target.value);
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <input type='email'
      placeholder='Enter your email'
      value={email}
      onChange={handleChange}/>
      <input type="password"
      placeholder='Enter your password'
      value={password}
      onChange={handlePassword}/>
    <input type="password"
      placeholder='Re-Enter your password'
      value={reenterpass}
      onChange={typepasswordagain}/>
    <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Signup
