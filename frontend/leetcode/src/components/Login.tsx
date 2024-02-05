import React,{useState} from 'react'
import { login } from '../api/api';
function Login() {
  const [email,setemail] = useState<string|undefined>();
  const [password,setpassword] = useState<string|undefined>();
const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
  setemail(e.target.value)
}
const handlePassword=(e: React.ChangeEvent<HTMLInputElement>)=>{
 setpassword(e.target.value);
}
const handlesubmit=(e: React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  login({email,password});
}
  return (
    <div>
      <form onSubmit={handlesubmit}>    
        <input type='email'
      placeholder='Enter your email'
      value={email}
      onChange={handleChange}/>
    <input type="password"
      placeholder='Enter your password'
      value={password}
      onChange={handlePassword}/>
     <button type="submit">Login
     </button>
     </form>
    </div>
  )
}

export default Login
