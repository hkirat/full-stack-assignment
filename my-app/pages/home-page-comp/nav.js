
import React, { useState } from 'react';


const Nav = () => {

    const [active, setActive] = useState(false);
    const [active2, setActive2] = useState(false);
    
    function logClick() {
        setActive(!active);
    }

    function signClick() {
        setActive2(!active2)
    }


    
        return (
            <div id="navbar">
                <nav className='nav'>
                    
                    
            
                    {!active?<button type="button" onClick={logClick}>Login</button>:null}
                    {!active2?<button type="button" onClick={signClick}>SignUp</button>:null}
                    {active?<label htmlFor="email" >Email</label>:null}
                    {active?<input type="textbox" name='email' ></input>:null}
                    {active?<label htmlFor="password">Password</label>:null}
                    {active?<input type="password" name='password' ></input>:null}  
                    {active?<button type="button" >Login</button>:null}
                    
                    
    
                </nav>

                <div className="signUpForm">
                    {active2?<h1>Sign Up Now !!</h1>:null}
                    <div className='mainForm'>
                        
                        
                        
                        
                       
                        <div>
                        <pre>{active2?<label htmlFor="fName" >     Full Name       </label>:null}
                        {active2?<input type="textbox" name='fName' id = 'fName'></input>:null}</pre>
                        </div>

                        <div>
                        <pre>{active2?<label htmlFor="email" >     Email           </label>:null}
                        {active2?<input type="textbox" name='email' ></input>:null}</pre>
                        </div>

                        <div>
                        <pre>{active2?<label htmlFor="pass" >     Password        </label>:null}
                        {active2?<input type="password" name='pass' ></input>:null}</pre>
                        </div>

                        <div>
                        <pre>{active2?<label htmlFor="conf-pass" >     Confirm Password</label>:null}
                        {active2?<input type="password" name='conf-pass' ></input>:null}</pre>
                        </div>

                        <div>
                             <pre>                         {active2?<button type="button" >Sign Up</button>:null}</pre>
                        </div>

                    </div>
                    
                </div>
    
            
            
            </div>
      
          
          
        )
      
}


export default Nav;
