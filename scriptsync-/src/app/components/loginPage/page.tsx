'use client'

import React from 'react'
import { useState,useEffect } from 'react'
import { useRouter } from 'next/router'

const loginPage = () => {

    const [username, setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError ] = useState<string | null>(null)
    const [loading, setLoading ] = useState(false)


    //fetch to the login page in backend 

  return (
    <div>
      
    </div>
  )
}

export default loginPage;
