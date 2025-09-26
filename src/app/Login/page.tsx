"use client"
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react'
import React from 'react'

function Page() {
  const { data: session , status} : { 
    data : Session | null ,
   status : "loading" | "authenticated" | "unauthenticated" 
  } = useSession();
  return (
    <div>
      <div className='text-center text-4xl font-bold'>Login</div>

    </div>
  )
}

export default Page
