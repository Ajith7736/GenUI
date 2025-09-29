import Link from 'next/link';
import React from 'react'
import { IoLogoIonic } from "react-icons/io";
import { usePathname } from 'next/navigation';


function Navbar() {

  const pathname: string = usePathname();

  return (
    <div className=' h-[10vh] flex items-center justify-between px-8'>
      <div className='flex items-center gap-3'>
        <IoLogoIonic size={30} />
        <Link href={"/"}><div className='text-2xl font-bold font-heading'>GenUI</div></Link>
      </div>
      <div className='flex gap-5 xl:gap-8 items-center'>
        <Link href={"/About"}><div className={`text-lg font-medium font-mono ${pathname !== "/About" && `text-light-darkgrey`}`}> About</div></Link>
        <Link href={"/Login"}><div className='text-lg rounded-md bg-light-mediumgrey hover:bg-light-mediumgrey/70 transition-all ease-in-out px-5 py-1 font-mono'>Login</div></Link>
      </div>
    </div>
  )
}

export default Navbar
