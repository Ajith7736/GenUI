import React, { useState } from 'react'
import { motion } from "framer-motion";
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { FaLaptopCode } from 'react-icons/fa';
import { useTheme } from 'next-themes';


function Modetoggler() {
    const { setTheme, theme } = useTheme();
    const [showtoggle, setshowtoggle] = useState<boolean>(false);


    return (
        <div className='flex flex-col items-center relative' >
            {showtoggle && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0, ease: "easeInOut", delay: 0 }}
                    className="bg-light-white dark:text-dark-white dark:bg-dark-lightblack dark:border dark:border-dark-mediumgrey transition-all ease-in-out duration-400 absolute bottom-13  h-fit w-[100px] rounded-xl shadow-md select-none">
                    {[
                        { id: "light", icon: <IoSunnyOutline />, label: "Light" },
                        { id: "dark", icon: <IoMoonOutline />, label: "Dark" },
                        { id: "system", icon: <FaLaptopCode />, label: "System" },
                    ].map(({ id, icon, label }, index) => {
                        return <div key={index} id={id} className={`flex items-center gap-2 p-1 hover:bg-light-mediumgrey dark:text-dark-grey hover:dark:text-dark-white hover:dark:bg-dark-mediumgrey ${id === "light" ? 'rounded-t-xl' : id === "dark" ? 'rounded-none' : 'rounded-b-xl'} transition-all ease-in-out duration-200 cursor-pointer`} onClick={() => {
                            setTheme(id);
                            setshowtoggle(false);
                        }}>{icon}{label}</div>
                    })}
                </motion.div>
            )}
            <button>{theme === "light" ? <IoSunnyOutline size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={() => setshowtoggle(!showtoggle)} /> : theme === "dark" ? <IoMoonOutline size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={() => setshowtoggle(!showtoggle)} /> : <FaLaptopCode size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={() => setshowtoggle(!showtoggle)} />}</button>
        </div >
    )
}

export default Modetoggler
