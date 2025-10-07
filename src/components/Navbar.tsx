import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
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
  const logref = useRef<HTMLDivElement>(null);

  const handleprofileclick = () => {
    setshowlogout(!showlogout)
  }


  useEffect(() => {

    const handleclickoutside = (Event: MouseEvent) => {
      if (logref.current && !logref.current.contains(Event.target as Node)) {
        setshowlogout(false)
      }
    }

    document.addEventListener("mousedown", handleclickoutside)

    return () => {
      document.removeEventListener("mousedown", handleclickoutside);
    }

  }, [])

  return (
    <div className='bg-light-white dark:bg-dark-mediumblack dark:text-dark-white h-[10vh] flex items-center justify-between px-8'>
      <div className='flex items-center gap-3'>
        <IoLogoIonic size={30} />
        <Link href={"/"}><div className='text-2xl font-bold font-heading'>GenUI</div></Link>
      </div>
      <div className='flex gap-5 xl:gap-8 items-center'>
        <Link href={"/About"}><div className={`sm:text-lg font-medium font-mono xss:text-base ${pathname !== "/About" && `text-light-darkgrey`}`}> About</div></Link>
        {session ? <><Image src={session.user?.image!} width={40} height={40} alt="Profile" onClick={handleprofileclick} className='w-8 h-8 lg:w-10 lg:h-10 rounded-full cursor-pointer' /></> : <Link href={"/Login"}><div className='sm:text-lg xss:text-base rounded-md bg-light-mediumgrey hover:bg-light-mediumgrey/70 dark:bg-dark-darkgrey hover:dark:bg-dark-darkgrey/80 transition-all ease-in-out px-5 py-1 font-mono'>Login</div></Link>}
      </div>
      {showlogout && <motion.div
        ref={logref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 0 }}
        className='absolute h-auto  flex flex-col justify-center z-1 rounded-md bg-light-white dark:bg-dark-darkgrey right-6 top-18 shadow-md'>
        <button className='text-red-600 p-2 rounded-md cursor-pointer flex gap-3 hover:bg-light-lightgrey dark:hover:bg-dark-mediumgrey justify-center font-medium xss:text-sm' onClick={() => signOut({ callbackUrl: "/" })}><IoIosLogOut className='size-5' />Logout</button>
        <div className='p-2 hover:bg-light-lightgrey hover:dark:bg-dark-mediumgrey cursor-pointer text-sm xss:text-sm'>{session?.user?.email}</div>
      </motion.div>}
    </div>
  )
}

export default Navbar
