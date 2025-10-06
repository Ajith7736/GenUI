import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import { IoLogoIonic } from 'react-icons/io';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { FaLaptopCode } from 'react-icons/fa';

function Modetoggler() {

    const [showtoggle, setshowtoggle] = useState<boolean>(false)
    const moderef = useRef<HTMLDivElement>(null)
    const [theme, settheme] = useState<"light" | "dark" | "system">(() => {
        let storedtheme: string | null = localStorage.getItem("theme")
        return storedtheme === "light" || storedtheme === "dark" || storedtheme === "system" ? storedtheme : "light";
    })

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

    useEffect(() => {
        localStorage.setItem("theme", theme);
        if (theme === "dark") document.documentElement.classList.add("dark");
        else if (theme === "light") document.documentElement.classList.remove("dark");
        else {
            const isdark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", isdark);
        }
        setshowtoggle(false);
    }, [theme])


    return (
        <div className='w-full flex justify-center'>
            {showtoggle && (
                <motion.div
                    ref={moderef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0, ease: "easeInOut", delay: 0 }}
                    className="bg-light-white dark:text-dark-white dark:bg-dark-lightblack transition-all ease-in-out duration-400 absolute bottom-25  h-fit w-[100px] rounded-xl shadow-md select-none">
                    <div className="flex items-center gap-2 p-1 hover:bg-light-mediumgrey hover:dark:bg-dark-mediumgrey rounded-t-xl transition-all ease-in-out duration-200 cursor-pointer" onClick={() => settheme("light")}><IoSunnyOutline />Light</div>
                    <div className="flex items-center gap-2 p-1 hover:bg-light-mediumgrey hover:dark:bg-dark-mediumgrey  cursor-pointer transition-all ease-in-out duration-200" onClick={() => settheme("dark")}><IoMoonOutline />Dark</div>
                    <div className="flex items-center gap-2 p-1 hover:bg-light-mediumgrey hover:dark:bg-dark-mediumgrey  cursor-pointer transition-all rounded-b-xl ease-in-out duration-200" onClick={() => settheme("system")}><FaLaptopCode />System</div>
                </motion.div>
            )}
            {theme === "light" ? <IoSunnyOutline size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={showToggle} /> : theme === "dark" ? <IoMoonOutline size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={showToggle} /> : <FaLaptopCode size={40} className="mt-6 cursor-pointer transition-all ease-in-out hover:bg-light-mediumgrey hover:dark:bg-dark-lightblack p-2 rounded-xl" onClick={showToggle} />}
        </div>
    )
}

export default Modetoggler
