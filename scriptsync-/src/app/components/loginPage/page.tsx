'use client'

import React, { FormEventHandler } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'

const loginPage = () => {

  //set all of our states and what changes when this page is ran 
  const [username, setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [error, setError ] = useState<string | null>(null)
  const [loading, setLoading ] = useState(false)
  const router = useRouter();


  const loginMeIn = async () => {

    setLoading(true); //setting the refresh clear
    setError(null);  //clear previous errors

    try {

      //now fetch make a post req to auth route to check users info
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), //this is what our obj exspect's from the user
      });

      if(!response.ok) {
        throw new Error('Login unsuccessful');
      } 
      //else we get the response!
      const data = await response.json();
      console.log('Login successful', data)
      router

      //after our "TRY" part of the function attempts to log the user in, there's a possibility the fetch doesn't work at all so 
      //our "CATCH" part of the function wil log an error stating that everything failed 
    } catch (error){
      setError('unexspected error');
    } finally {
      setLoading(false);
    };
  }


  //Lastly you need your handleSubmit function to submit the entire form, without it the you wont be ab;e to submit the form 
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          loginMeIn()
        }

  return (
    <div>
      <div className='login-container'> 
        <h2>Login</h2>

     <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id='username' value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="passsword">Password:</label>
          <input type="text" id='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "logging in..." : "Try again"}
        </button>

     </form>
     </div>
    </div>
  )
}

export default loginPage;
