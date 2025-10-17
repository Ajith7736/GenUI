"use client"

import { useEffect, useRef, useState } from "react";
import Codeblock from "@/components/Codeblock";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Loading from "@/components/Loading";
import { FiPlus } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosAdd } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { GiHamburgerMenu } from "react-icons/gi";
import { SlOptions } from "react-icons/sl";
import toast from "react-hot-toast";
import Projectinput from "@/components/ProjectInput";
import Preview from "@/components/Preview";
import CodeEditor from "@/components/CodeEditor";
import Promptinput from "@/components/Promptinput";
import OutputToggler from "@/components/OutputToggler";



function page() {

  interface Formvalue {
    projectName: string | null
  }

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

  interface currentprompt {
    id: string,
    projectid: string,
    projectName: string,
    text: string,
    code: string
  }

  interface deletetoggleprops {
    id: string | null,
    show: boolean,
    isproject: boolean
  }

  const [onActive, setonActive] = useState<string>("Code")
  const [jsxgeneratedcode, setjsxgeneratedcode] = useState<string>("")
  const [loading, setloading] = useState<boolean>(false)
  const [copycode, setcopycode] = useState<boolean>(false)
  const { data: session, status }: { data: Session | null, status: "loading" | "unauthenticated" | "authenticated" } = useSession();
  const router: AppRouterInstance = useRouter();
  const [prompt, setprompt] = useState<string>("");
  const [iseditting, setiseditting] = useState<boolean>(false)
  const [projectdata, setprojectdata] = useState<Formvalue | null>(null)
  const [projecttoggle, setprojecttoggle] = useState<boolean>(false);
  const [projectdetails, setprojectdetails] = useState<Project[] | null>(null)
  const [showprompts, setshowprompts] = useState<showprompt | null>({ projectName: null, show: false })
  const [currentprompt, setcurrentprompt] = useState<currentprompt | null>(null)
  const [showsidebar, setshowsidebar] = useState<boolean>(false)
  const sideref = useRef<HTMLDivElement>(null);
  const deleteref = useRef<HTMLButtonElement>(null)
  const [deletetoggle, setdeletetoggle] = useState<deletetoggleprops | null>(null)
  const [projectloader, setprojectloader] = useState<boolean>(true)


  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      getproject();
    }
  }, [session, status])


  const getproject = async () => {
    let res = await fetch("/api/getproject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: session?.user.id })
    })
    let data = await res.json();
    if (res.status === 200) {
      setprojectdetails(data.projects)
      setprojectloader(false)
    } else {
      setprojectloader(false);
    }
  }

  useEffect(() => {
    if (projectdata) {
      addproject();
    }
  }, [projectdata])

  const addproject = async () => {
    try {
      setprojecttoggle(true);
      let res = await fetch("api/project",
        {
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          }, body: JSON.stringify({ ...projectdata, userId: session?.user.id })
        })
      let data = await res.json()
      if (res.status === 200) {
        projectdetails ? setprojectdetails([...projectdetails, data.project]) : setprojectdetails([data.project])
        setprojecttoggle(false);
      } else if (res.status >= 400) {
        toast.error("Project Already Exists")
      }
    } catch (err) {
      toast.error("Server Error")
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/")
    }
  }, [status, router]);


  const handleproject = () => {
    setprojecttoggle(!projecttoggle)
    setshowsidebar(false);
  }

  const handleshowprompt = (e: React.MouseEvent<any>) => {
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
          let newprompt = { id: uuidv4(), text: "", code: "", createdAt: new Date() }
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

  const handlecurrentprompt = (e: React.MouseEvent<HTMLDivElement>, id: string, projectName: string, text: string, code: string) => {
    const projectid = e.currentTarget.id;
    setcurrentprompt({ id, projectid, projectName, text, code })
    setjsxgeneratedcode(code)
    setprompt(text)
    setshowsidebar(false);
  }



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


  const deleteprompt = async (projectid: string, promptid: string | null | undefined, text: string | null | undefined, isproject: boolean) => {
    if (isproject) {
      let res = await fetch("/api/deleteproject", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ projectid })
      })
      let data = await res.json();
      if (res.status === 200) {
        setprojectdetails(data.updatedproject);
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
      let res = await fetch("/api/deleteprompt", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ projectid, promptid })
      })
      let data = await res.json();

      if (res.status === 200) {
        projectdetails && setprojectdetails((prev) => {
          if (!prev) return prev
          const newpro = prev.map((project) => {
            return project._id === data.updatedproject._id ? data.updatedproject : project;
          })

          return newpro;
        })
      }
      if (res.status >= 400) {
        toast.error(data.message);
      }
    }
  }


  return (
    <>
      {/* {status === "loading" && <div className="fixed z-40 top-0">
        <Loading />
      </div>} */}

      <Projectinput projecttoggle={projecttoggle} setprojecttoggle={setprojecttoggle} projectdetails={projectdetails} setprojectdetails={setprojectdetails} />

      <div className="flex dark:bg-dark-mediumblack justify-around">
        <button onClick={() => setshowsidebar(!showsidebar)} className="lg:hidden fixed border border-light-darkgrey/30 bg-light-mediumgrey backdrop-blur-md hover:bg-light-darkgrey/20 z-10 transition-all ease-in-out left-5 p-2 rounded-md hover:dark:bg-dark-white/90 dark:bg-dark-white cursor-pointer shadow-md dark:text-dark-black" ><GiHamburgerMenu className="size-5" /></button>
        <div ref={sideref} className={`dark:bg-dark-input-outline w-[25rem] z-10 fixed h-[90vh] ${showsidebar ? `left-0` : `-left-100`} transition-all duration-500 ease-in-out lg:left-0 flex flex-col p-5 border dark:border-dark-grey/20 border-light-grey bg-light-lightgrey border-l-0 border-y-0 `}>
          <button className="p-2 dark:bg-dark-white bg-light-black text-light-white hover:bg-light-black/90 transition-all ease-in-out dark:text-dark-black font-bold rounded-md cursor-pointer  hover:dark:bg-dark-white/90 flex justify-center gap-2" onClick={handleproject}><FiPlus className="size-6" />Create new Project</button>
          {projectloader && <> <div className="bg-light-grey dark:bg-dark-mediumgrey rounded-full mt-10 animate-pulse w-full h-[5px]"></div>
            <div className="bg-light-grey dark:bg-dark-mediumgrey rounded-full mt-5 animate-pulse w-1/2 h-[5px]"></div></>}
          <AnimatePresence mode="sync">
            <motion.div className="flex flex-col gap-5 mt-8">
              {projectdetails?.map((item, index) => {
                return <motion.div key={index} >
                  <button className="rounded-md w-[100%] flex items-center justify-between focus:outline-none cursor-pointer" id={item.projectName} >
                    <div className="w-full text-start" id={item.projectName} onClick={(e) => handleshowprompt(e)}>{item.projectName}</div>
                    <div className="flex gap-2 items-center">
                      <IoIosAdd className="size-6 dark:text-dark-white" id={item.projectName} onClick={(e) => handlenewprompt(e)} />
                      <IoIosArrowDown className={`size-4 transition-all ease-in-out ${showprompts?.projectName === item.projectName && showprompts.show ? 'rotate-180' : 'rotate-0'}`} id={item.projectName} onClick={(e) => handleshowprompt(e)} />
                      <div className="relative" tabIndex={0} onBlur={() => setTimeout(() => {
                        setdeletetoggle({ id: null, show: false, isproject: false })
                      }, 100)}>
                        <SlOptions className="focus:outline-none" onClick={() => { setdeletetoggle({ id: item._id, show: !deletetoggle?.show, isproject: true }) }} />
                        {(deletetoggle?.show && item._id === deletetoggle?.id && deletetoggle.isproject) && <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute  bg-light-mediumgrey dark:bg-dark-mediumgrey cursor-pointer hover:dark:bg-dark-lightblack hover:bg-light-grey transition-all ease-in-out border border-light-darkgrey/70 dark:border-dark-grey/20 z-50 p-2 rounded-full -bottom-10 -right-5 text-red-500" onMouseDown={() => deleteprompt(item._id, null, null, true)}>Delete</motion.div>}
                      </div>
                    </div>
                  </button>
                  {showprompts?.projectName === item.projectName && showprompts.show &&
                    item.prompts?.map((prompt, indx) => {
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
                          <div className={`${currentprompt?.id === prompt.id && currentprompt.projectName === item.projectName ? `bg-light-grey dark:bg-dark-input-box dark:text-dark-white text-light-black` : `hover:dark:bg-dark-input-box hover:bg-light-grey dark:text-dark-grey text-light-darkgrey hover:dark:text-dark-white hover:text-light-black`} transition-all relative  ease-in-out rounded-md p-2 mt-3 cursor-pointer w-full flex justify-between items-center`} >
                            <div id={item._id} className="w-full" onClick={(e) => handlecurrentprompt(e, prompt.id, item.projectName, prompt.text, prompt.code)}>Blank Prompt</div>
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
                              {(deletetoggle?.show && prompt.id === deletetoggle?.id) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bg-light-mediumgrey dark:bg-dark-mediumgrey cursor-pointer hover:dark:bg-dark-lightblack hover:bg-light-grey transition-all ease-in-out border border-light-darkgrey/70 dark:border-dark-grey/20 z-50 p-2 rounded-full -bottom-10 -right-5 text-red-500" onClick={() => deleteprompt(item._id, prompt.id, prompt.text, false)}>Delete</motion.div>}
                            </button>                          </div>
                          : <><div className={`${currentprompt?.id === prompt.id && currentprompt.projectid === item._id ? `bg-light-grey dark:bg-dark-input-box dark:text-dark-white text-light-black` : `hover:dark:bg-dark-input-box hover:bg-light-grey dark:text-dark-grey text-light-darkgrey hover:dark:text-dark-white hover:text-light-black`} transition-all relative ease-in-out rounded-md p-2 mt-3 cursor-pointer w-full flex justify-between items-center`}>
                            <div id={item._id} className="w-[90%] text-ellipsis whitespace-nowrap overflow-hidden" onClick={(e) => handlecurrentprompt(e, prompt.id, item.projectName, prompt.text, prompt.code)}>{prompt.text}</div>
                            <button ref={deleteref} onBlur={() => setdeletetoggle({ id: null, show: false, isproject: false })}>
                              <SlOptions className="cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                setdeletetoggle({
                                  id: prompt.id,
                                  show: !deletetoggle?.show,
                                  isproject: false
                                })
                              }
                              } />
                              {(deletetoggle?.show && prompt.id === deletetoggle?.id) && <motion.div onClick={() => deleteprompt(item._id, prompt.id, prompt.text, false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
        
        <div className="flex flex-col xss:w-full md:w-[80vw] lg:w-fit lg:ml-[25rem] xl:ml-[20rem] gap-5 bg-light-white dark:bg-dark-mediumblack min-h-[90vh] p-5">

          <Promptinput
            prompt={prompt}
            currentprompt={currentprompt}
            loading={loading}
            setloading={setloading}
            setjsxgeneratedcode={setjsxgeneratedcode}
            setprojectdetails={setprojectdetails}
            setprojecttoggle={setprojecttoggle}
          />

          <div className=" bg-light-white dark:bg-dark-input-outline border border-light-grey dark:border-dark-grey/20 h-[60vh] lg:w-[50vw] rounded-md flex flex-col mb-10">
            <OutputToggler
              copycode={copycode}
              jsxgeneratedcode={jsxgeneratedcode}
              onActive={onActive}
              setcopycode={setcopycode}
              setonActive={setonActive}
            />
            {onActive === "Preview" ?
              <>
                {/* Preview */}
                <Preview jsxgeneratedcode={jsxgeneratedcode} />
              </>
              :
              <>
                <div className={`h-[53.5vh] dark:bg-dark-input-box rounded-b-md ${iseditting ? 'overflow-hidden' : ''} bg-light-lightgrey relative`}>
                  {
                    jsxgeneratedcode.length === 0 ? <div className="m-6 xss:text-sm sm:text-base">No code to show.</div> : <>
                      {iseditting ?
                        <CodeEditor
                          jsxgeneratedcode={jsxgeneratedcode}
                          setjsxgeneratedcode={setjsxgeneratedcode}
                          setiseditting={setiseditting}
                        /> :
                        (<><div className="">
                          <Codeblock
                            code={jsxgeneratedcode}
                            language="jsx"
                          />
                        </div>
                          <button className="absolute top-3 right-3 bg-light-black dark:bg-dark-white dark:text-dark-black text-light-white px-3 py-2 cursor-pointer rounded-md text-sm hover:bg-light-black/80 hover:dark:bg-dark-white/90 transition ease-in-out" onClick={() => setiseditting(true)}>Edit Code</button>
                        </>)}</>
                  }
                </div>
              </>
            }
            <div>
            </div>
          </div>
        </div >
      </div >
    </>

  )
}

export default page
