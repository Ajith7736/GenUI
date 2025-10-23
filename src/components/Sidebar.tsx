import { motion, AnimatePresence } from 'framer-motion';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoIosAdd, IoIosArrowDown } from 'react-icons/io';
import { SlOptions } from 'react-icons/sl';
import { v4 as uuidv4 } from "uuid";
import { useProject } from './context/ProjectProvider';

interface prompts {
    id: string,
    text: string,
    code: string,
    createdAt: Date
}

interface Project {
    _id: string,
    userId: string,
    projectName: string,
    prompts: prompts[] | null,
    createdAt: Date,
    UpdatedAt: Date
}

interface showprompt {
    projectName: string | null,
    show: boolean;
}


interface deletetoggleprops {
    id: string | null,
    show: boolean,
    isproject: boolean
}

interface currentprompt {
    id: string,
    projectid: string,
    projectName: string,
    text: string,
    code: string
}

interface showprompt {
    projectName: string | null,
    show: boolean;
}

interface props {
    setprojecttoggle: React.Dispatch<React.SetStateAction<boolean>>,
    projecttoggle: boolean,
    deletetoggle: deletetoggleprops | null,
    setdeletetoggle: React.Dispatch<React.SetStateAction<deletetoggleprops | null>>,
    currentprompt: currentprompt | null,
    setcurrentprompt: React.Dispatch<React.SetStateAction<currentprompt | null>>,
}

function Sidebar({ currentprompt, setcurrentprompt, deletetoggle, setdeletetoggle, projecttoggle, setprojecttoggle }: props) {

    const sideref = useRef<HTMLDivElement>(null);
    const [showsidebar, setshowsidebar] = useState<boolean>(false)
    const { data: session, status }: { data: Session | null, status: string } = useSession();
    const [projectloader, setprojectloader] = useState<boolean>(true)
    const { projectdetails, setprojectdetails, setprompt, setjsxgeneratedcode } = useProject();
    const [showprompts, setshowprompts] = useState<showprompt | null>({ projectName: null, show: false })

    // fetch api call to get all the project of the specific user from the DB.

    const getproject = useCallback(async () => {
        const userId = session?.user.id;
        if (!userId) return

        const cachekey = `projects_${userId}`
        const cache = localStorage.getItem(cachekey)

        if (cache) {
            setprojectdetails(JSON.parse(cache));
            setprojectloader(false);
        }
        const res = await fetch("/api/getproject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: session?.user.id })
        })
        const data = await res.json();
        if (res.status === 200) {
            setprojectdetails(data.projects)
            localStorage.setItem(cachekey, JSON.stringify(data.projects));
        } else if (res.status === 500) {
            toast.error(data.message);
        }
        setprojectloader(false);
    }, [session])

    useEffect(() => {
        if (status === "authenticated" && session?.user.id) {
            getproject();
        }
    }, [session, status, getproject])


    // close the sidebar when user clicks outside the sidebar

    useEffect(() => {

        const handleclickoutside = (Event: MouseEvent) => {
            if (sideref.current && !sideref.current.contains(Event.target as Node)) {
                setshowsidebar(false);
            }
        }

        document.addEventListener("mousedown", handleclickoutside);

        return () => {
            document.removeEventListener("mousedown", handleclickoutside);
        }
    }, [])

    // show the project input and hide the side bar.

    const handleproject = () => {
        setprojecttoggle(!projecttoggle)
        setshowsidebar(false);
    }

    // when the user clicks on a particular project it will show all the prompts inside that project.

    const handleshowprompt = (e: React.MouseEvent<HTMLDivElement | SVGElement>) => {
        if (showprompts?.projectName !== e.currentTarget.id) {
            return setshowprompts({
                projectName: e.currentTarget.id,
                show: true
            })
        }
        return setshowprompts({
            projectName: e.currentTarget.id,
            show: !showprompts?.show
        })
    }

    // creates a blank prompt

    const handlenewprompt = (e: React.MouseEvent<SVGElement>) => {
        const name = e.currentTarget.id;
        setshowprompts({
            projectName: name,
            show: true
        })
        setprojectdetails((prev) => {
            if (!prev) return prev
            return prev.map((project) => {
                if (project.projectName === name) {
                    const newprompt = { id: uuidv4(), text: "", code: "", createdAt: new Date() }
                    return {
                        ...project,
                        prompts: project.prompts
                            ? [...project.prompts, newprompt]
                            : [newprompt]
                    };
                }
                return project;
            })
        })
    }

    // fetch api call for deleting project or prompt

    const deleteprompt = async (projectid: string, promptid: string | null | undefined, text: string | null | undefined, isproject: boolean) => {
        if (isproject) {
            const res = await fetch("/api/deleteproject", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ projectid, userId: session?.user.id })
            })
            const data = await res.json();
            if (res.status === 200) {
                setprojectdetails(data.updatedproject);
                localStorage.removeItem(`projects_${session?.user?.id}`);
                projectid === currentprompt?.projectid && setcurrentprompt(null);
            } else if (res.status >= 400) {
                toast.error(data.message);
            }
        } else {
            if (text === "") {
                setprojectdetails((prev) => {
                    if (!prev) return prev;
                    return prev.map((project) => {
                        if (project._id === projectid) {
                            const updatedprompts = project.prompts!.filter((prompt) => prompt.id !== promptid)
                            return { ...project, prompts: updatedprompts };
                        }
                        return project;
                    });
                });
                return;
            }
            const res = await fetch("/api/deleteprompt", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ projectid, promptid })
            })
            const data = await res.json();

            if (res.status === 200) {
                projectdetails && setprojectdetails((prev) => {
                    if (!prev) return prev
                    const newpro = prev.map((project) => {
                        return project._id === data.updatedproject._id ? data.updatedproject : project;
                    })
                    return newpro;
                })
                localStorage.removeItem(`projects_${session?.user?.id}`);
            }
            if (res.status >= 400) {
                toast.error(data.message);
            }
        }
    }

    // set current prompt when user click on a particular prompt

    const handlecurrentprompt = (e: React.MouseEvent<HTMLDivElement>, id: string, projectName: string, text: string, code: string) => {
        const projectid = e.currentTarget.id;
        setcurrentprompt({ id, projectid, projectName, text, code })
        setjsxgeneratedcode(code)
        setprompt(text)
        setshowsidebar(false);
    }

    return (
        <div>
            <button onClick={() => setshowsidebar(!showsidebar)} className="lg:hidden fixed border border-light-darkgrey/30 bg-light-mediumgrey backdrop-blur-md hover:bg-light-darkgrey/20 z-10 transition-all ease-in-out left-5 p-2 rounded-md hover:dark:bg-dark-white/90 dark:bg-dark-white cursor-pointer shadow-md dark:text-dark-black" ><GiHamburgerMenu className="size-5" /></button>
            <div ref={sideref} className={`dark:bg-dark-input-outline overflow-auto sm:w-100 xss:w-[20rem] z-10 fixed h-[90vh] ${showsidebar ? `left-0` : `-left-100`} transition-all duration-500 ease-in-out lg:left-0 flex flex-col p-5 border dark:border-dark-grey/20 border-light-grey bg-light-lightgrey border-l-0 border-y-0 `}>
                <button className="p-2 dark:bg-dark-white bg-light-black text-light-white hover:bg-light-black/90 transition-all ease-in-out dark:text-dark-black font-bold rounded-md cursor-pointer  hover:dark:bg-dark-white/90 flex justify-center gap-2" onClick={handleproject}><FiPlus className="size-6" />Create new Project</button>
                {projectloader && <> <div className="bg-light-grey dark:bg-dark-mediumgrey rounded-full mt-10 animate-pulse w-full h-[5px]"></div>
                    <div className="bg-light-grey dark:bg-dark-mediumgrey rounded-full mt-5 animate-pulse w-1/2 h-[5px]"></div></>}
                <AnimatePresence mode="sync">
                    <motion.div className="flex flex-col gap-5 mt-8">
                        {projectdetails?.map((project, index) => {
                            return <motion.div key={index} >
                                <button className="rounded-md w-full flex items-center justify-between focus:outline-none cursor-pointer" id={project.projectName} >
                                    <div className="w-full text-start" id={project.projectName} onClick={(e) => handleshowprompt(e)}>{project.projectName}</div>
                                    <div className="flex gap-2 items-center">
                                        <IoIosAdd className="size-6 dark:text-dark-white" id={project.projectName} onClick={(e) => handlenewprompt(e)} />
                                        <IoIosArrowDown className={`size-4 transition-all ease-in-out ${showprompts?.projectName === project.projectName && showprompts.show ? 'rotate-180' : 'rotate-0'}`} id={project.projectName} onClick={(e) => handleshowprompt(e)} />
                                        <div className="relative" tabIndex={0} onBlur={() => setTimeout(() => {
                                            setdeletetoggle({ id: null, show: false, isproject: false })
                                        }, 100)}>
                                            <SlOptions className="focus:outline-none" onClick={() => { setdeletetoggle({ id: project._id, show: !deletetoggle?.show, isproject: true }) }} />
                                            {(deletetoggle?.show && project._id === deletetoggle?.id && deletetoggle.isproject) && <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute  bg-light-mediumgrey dark:bg-dark-mediumgrey cursor-pointer hover:dark:bg-dark-lightblack hover:bg-light-grey transition-all ease-in-out border border-light-darkgrey/70 dark:border-dark-grey/20 z-50 p-2 rounded-full -bottom-10 -right-5 text-red-500" onMouseDown={() => deleteprompt(project._id, null, null, true)}>Delete</motion.div>}
                                        </div>
                                    </div>
                                </button>
                                {showprompts?.projectName === project.projectName && showprompts.show &&
                                    project.prompts?.map((prompt, indx) => {
                                        return < motion.div
                                            key={indx}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0, ease: "easeOut" }}
                                            style={{ originY: 0 }}
                                        >
                                            {prompt.text === "" ?
                                                <div className={`${currentprompt?.id === prompt.id && currentprompt.projectName === project.projectName ? `bg-light-grey dark:bg-dark-input-box dark:text-dark-white text-light-black` : `hover:dark:bg-dark-input-box hover:bg-light-grey dark:text-dark-grey text-light-darkgrey hover:dark:text-dark-white hover:text-light-black`} transition-all relative  ease-in-out rounded-md p-2 mt-3 cursor-pointer w-full flex justify-between items-center`} >
                                                    <div id={project._id} className="w-full" onClick={(e) => handlecurrentprompt(e, prompt.id, project.projectName, prompt.text, prompt.code)}>Blank Prompt</div>
                                                    <button onBlur={() => setdeletetoggle({ id: null, show: false, isproject: false })}>
                                                        <SlOptions className="cursor-pointer" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setdeletetoggle({
                                                                id: prompt.id,
                                                                show: !deletetoggle?.show,
                                                                isproject: false
                                                            })
                                                        }
                                                        } />
                                                        {(deletetoggle?.show && prompt.id === deletetoggle?.id) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bg-light-mediumgrey dark:bg-dark-mediumgrey cursor-pointer hover:dark:bg-dark-lightblack hover:bg-light-grey transition-all ease-in-out border border-light-darkgrey/70 dark:border-dark-grey/20 z-50 p-2 rounded-full -bottom-10 -right-5 text-red-500" onClick={() => deleteprompt(project._id, prompt.id, prompt.text, false)}>Delete</motion.div>}
                                                    </button>                          </div>
                                                : <><div className={`${currentprompt?.id === prompt.id && currentprompt.projectid === project._id ? `bg-light-grey dark:bg-dark-input-box dark:text-dark-white text-light-black` : `hover:dark:bg-dark-input-box hover:bg-light-grey dark:text-dark-grey text-light-darkgrey hover:dark:text-dark-white hover:text-light-black`} transition-all relative ease-in-out rounded-md p-2 mt-3 cursor-pointer w-full flex justify-between items-center`}>
                                                    <div id={project._id} className="w-[90%] text-ellipsis whitespace-nowrap overflow-hidden" onClick={(e) => handlecurrentprompt(e, prompt.id, project.projectName, prompt.text, prompt.code)}>{prompt.text}</div>
                                                    <button onBlur={() => setdeletetoggle({ id: null, show: false, isproject: false })}>
                                                        <SlOptions className="cursor-pointer" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setdeletetoggle({
                                                                id: prompt.id,
                                                                show: !deletetoggle?.show,
                                                                isproject: false
                                                            })
                                                        }
                                                        } />
                                                        {(deletetoggle?.show && prompt.id === deletetoggle?.id) && <motion.div onClick={() => deleteprompt(project._id, prompt.id, prompt.text, false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                            className="absolute bg-light-mediumgrey dark:bg-dark-mediumgrey cursor-pointer hover:dark:bg-dark-lightblack hover:bg-light-grey transition-all ease-in-out border border-light-darkgrey/70 dark:border-dark-grey/20 z-50 p-2 rounded-full -bottom-10 -right-5 text-red-500">Delete</motion.div>}
                                                    </button>
                                                </div>
                                                </>
                                            }

                                        </motion.div>
                                    })
                                }
                            </motion.div>
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Sidebar
