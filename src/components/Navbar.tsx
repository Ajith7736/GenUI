import Link from 'next/link';
import React from 'react'


function Navbar() {

  return (
    <div className=' h-[10vh] flex items-center justify-between px-8'>
      <Link href={"/"}><div className='text-3xl font-bold'>GenUI</div></Link>
      <div className='flex gap-5 xl:gap-15'>
        <Link href={"/About"}><div className='text-xl font-semibold'> About</div></Link>
        <Link href={"/"}><div className='text-xl font-semibold'>Github</div></Link>
        <Link href={"/Login"}><div className='text-xl font-semibold'>Login</div></Link>
      </div>
    </div>
  )
}

export default Navbar
