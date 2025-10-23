import Link from 'next/link';
import React, { useState } from 'react'
import { IoLogoIonic } from "react-icons/io";
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { IoIosLogOut } from "react-icons/io";
import { signOut } from 'next-auth/react'
import Image from 'next/image';



function Navbar() {

  const { data: session }: { data: Session | null } = useSession();
  const pathname: string = usePathname();
  const [showlogout, setshowlogout] = useState<boolean>(false)



  return (
    <div className='bg-light-white/60 sticky top-0 z-40 backdrop-blur-md dark:bg-dark-mediumblack/70 dark:text-dark-white h-[10vh] flex items-center justify-between px-8'>
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <IoLogoIonic size={30} />
        <Link href={"/"}><div className='text-2xl font-bold font-heading'>GenUI</div></Link>
      </div>
      <div className='flex gap-5 xl:gap-8 items-center'>
        <Link href={"/"}><div className={`sm:text-lg font-medium font-mono xss:text-base ${pathname !== "/" && `text-light-darkgrey`}`}>Home</div></Link>
        {session ? (<div tabIndex={0} onBlur={() => setTimeout(() => setshowlogout(false), 100)}><Image onClick={() => setshowlogout((prev) => !prev)} src={session?.user?.image ?? '/default-avatar.png'} unoptimized width={40} height={40} alt="Profile" className='w-8 h-8 lg:w-10 lg:h-10 rounded-full cursor-pointer' />
          {showlogout && (<motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0 }}
            className='absolute h-auto  flex flex-col justify-center z-1 rounded-md bg-light-white dark:bg-dark-input-outline border border-light-grey/20 dark:border-dark-grey/20 right-6 top-18 shadow-lg'>
            <button className='text-red-600 p-2 rounded-t-md cursor-pointer flex gap-3 hover:bg-light-lightgrey dark:hover:bg-dark-input-box justify-center font-medium xss:text-sm' onClick={() => signOut({ callbackUrl: "/" })}><IoIosLogOut className='size-5' />Logout</button>
            <div className='p-2 hover:bg-light-lightgrey hover:dark:bg-dark-input-box text-sm xss:text-sm rounded-b-md'>{session?.user?.email}</div>
          </motion.div>
          )}</div>
        ) : <Link href={"/Login"}><div className='sm:text-lg xss:text-base rounded-md bg-light-mediumgrey hover:bg-light-mediumgrey/70 dark:bg-dark-darkgrey hover:dark:bg-dark-darkgrey/80 transition-all ease-in-out px-5 py-1 font-mono'>Login</div></Link>}
      </div>
    </div>
  )
}

export default Navbar
