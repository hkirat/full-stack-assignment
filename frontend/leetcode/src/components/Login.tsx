import React, { useState } from 'react';
import { login } from '../api/api';
import { useHistory } from 'react-router-dom'; // Import useHistory hook for redirection

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const history = useHistory(); // Initialize useHistory hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if (response.success) {
        // Redirect to dashboard upon successful login
        history.push(response.redirectTo);
        window.location.reload();
      } else {
        // Handle unsuccessful login (e.g., display error message)
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='email'
          placeholder='Enter your email'
          value={email}
          onChange={handleChange}
        />
        <input type="password"
          placeholder='Enter your password'
          value={password}
          onChange={handlePassword}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
