import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { FaLaptopCode } from 'react-icons/fa';
import { useTheme } from 'next-themes';


function Modetoggler() {
    const { setTheme, theme } = useTheme();
    const [showtoggle, setshowtoggle] = useState<boolean>(false)
    const moderef = useRef<HTMLDivElement>(null)


    useEffect(() => {

        const handleclickoutside = (Event: MouseEvent) => {
            if (moderef.current && !moderef.current.contains(Event.target as Node)) {
                setshowtoggle(false)
            }
        }

        document.addEventListener("mousedown", handleclickoutside)

        return () => {
            document.removeEventListener("mousedown", handleclickoutside);
        }

    }, [])

    const showToggle = (): void => {
        setshowtoggle(!showtoggle);
    }



    return (
        <div className='w-full flex justify-center'>
            {showtoggle && (
                <motion.div
                    ref={moderef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0, ease: "easeInOut", delay: 0 }}
                    className="bg-light-white dark:text-dark-white dark:bg-dark-lightblack dark:border dark:border-dark-mediumgrey transition-all ease-in-out duration-400 absolute bottom-25  h-fit w-[100px] rounded-xl shadow-md select-none">
                    <div className="flex items-center gap-2 p-1 hover:bg-light-mediumgrey dark:text-dark-grey hover:dark:text-dark-white hover:dark:bg-dark-mediumgrey rounded-t-xl transition-all ease-in-out duration-200 cursor-pointer" onClick={() => {
                        setTheme('light');
                        setshowtoggle(false);
                    }}><IoSunnyOutline />Light</div>
                    <div className="flex items-center gap-2 p-1 hover:bg-light-mediumgrey hover:dark:bg-dark-mediumgrey  dark:text-dark-grey hover:dark:text-dark-white  cursor-pointer transition-all ease-in-out duration-200" onClick={() => {
                        setTheme("dark");
                        setshowtoggle(false);
                    }}><IoMoonOutline />Dark</div>
                    <div className="flex items-center gap-2 p-1 hover:bg-light-mediumgrey hover:dark:bg-dark-mediumgrey  dark:text-dark-grey hover:dark:text-dark-white  cursor-pointer transition-all rounded-b-xl ease-in-out duration-200" onClick={() => {
                        setTheme("system");
                        setshowtoggle(false);
                    }}><FaLaptopCode />System</div>
                </motion.div>
            )}
            {theme === "light" ? <IoSunnyOutline size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={showToggle} /> : theme === "dark" ? <IoMoonOutline size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={showToggle} /> : <FaLaptopCode size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={showToggle} />}
        </div>
    )
}

export default Modetoggler
