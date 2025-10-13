"use client"

import { useEffect, useRef, useState } from "react";
import { LuCopy } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import Codeblock from "@/components/Codeblock";
import { LuCheck } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Loading from "@/components/Loading";
import { IoClose } from "react-icons/io5";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useForm, SubmitHandler } from "react-hook-form"
import { FiPlus } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosAdd } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { GiHamburgerMenu } from "react-icons/gi";



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
    projectName: string,
    show: boolean;
  }

  interface currentprompt {
    id: string,
    projectid: string,
    projectName: string,
    text: string,
    code: string
  }

  const [onActive, setonActive] = useState<string | null>("Code")
  const textref = useRef<HTMLTextAreaElement | null>(null);
  const [jsxgeneratedcode, setjsxgeneratedcode] = useState<string>("")
  const [loading, setloading] = useState<boolean>(false)
  const [copycode, setcopycode] = useState<boolean>(false)
  const { data: session, status }: { data: Session | null, status: "loading" | "unauthenticated" | "authenticated" } = useSession();
  const router: AppRouterInstance = useRouter();
  const [prompt, setprompt] = useState<string>("");
  const [iseditting, setiseditting] = useState<boolean>(false)
  const [projectdata, setprojectdata] = useState<Formvalue | null>(null)
  const { resolvedTheme } = useTheme();
  const [projecttoggle, setprojecttoggle] = useState<boolean>(false);
  const [projectdetails, setprojectdetails] = useState<Project[] | null>(null)
  const [showprompts, setshowprompts] = useState<showprompt | null>(null)
  const [currentprompt, setcurrentprompt] = useState<currentprompt | null>(null)
  const [showsidebar, setshowsidebar] = useState<boolean>(false)
  const sideref = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<Formvalue>()
  const onSubmit: SubmitHandler<Formvalue> = async (data) => {
    await delay();
    setprojectdata(data);
  }


  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      getproject();
    }
  }, [session, status])





  const delay = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    })
  }



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
    }
  }

  useEffect(() => {
    if (projectdata) {
      addproject();
    }
  }, [projectdata])

  const addproject = async () => {
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
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/")
    }
  }, [status, router]);


  const handlepreview = (): void => {
    setonActive("Preview")
  }

  const handlecode = (): void => {
    setonActive("Code")
  }

  const generate = async (prompt: string) => {
    setloading(true)
    let res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    let data = await res.json();

    if (res.status === 200) {
      let jsxcode: string | null = await codeextrator("htmlcode", data.text);
      if (jsxcode) {
        setjsxgeneratedcode(jsxcode);
        addprompt(prompt, jsxcode)
      }
      setloading(false);
    } else if (res.status === 400 || res.status === 500) {
      setloading(false)
    }
  };

  const addprompt = async (text: string, code: string) => {
    let res = await fetch("/api/createprompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: { text, code, id: currentprompt?.id }, projectid: currentprompt?.projectid })
    })
    let data = await res.json();
    if (res.status === 200) {
      setprojectdetails((prev) => {
        if (!prev) return [data.updatedproject]
        return prev?.map((proj) => {
          return proj._id === data.updatedproject._id ? data.updatedproject : proj
        })
      })
      console.log(data.message)
    } else {
      console.log(data.message)
    }
  }


  const handletext = (): void => {
    if (textref.current?.value !== "") {
      if (currentprompt) {
        generate(textref.current?.value!)
      } else {
        setprojecttoggle(true);
      }
    }
  }

  const handlecopy = (): void => {
    setcopycode(true);
    navigator.clipboard.writeText(jsxgeneratedcode);
    setTimeout(() => {
      setcopycode(false)
    }, 2000);
  }

  const codeextrator = (language: string, code: string): string | null => {
    let startdelimeter: string = language;
    let enddelimeter: string = `#end${language}`;

    let startindex: number = code.indexOf(startdelimeter);

    let endindex: number = code.indexOf(enddelimeter);

    if (startindex !== -1 && endindex !== -1) {
      let adjustedindex: number = startindex + startdelimeter.length;
      let extractedcode: string = code.slice(adjustedindex, endindex);
      return extractedcode;
    } else {
      return null;
    }
  }

  const handleproject = () => {
    setprojecttoggle(!projecttoggle)
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


  const handleprojectclose = () => {
    setprojecttoggle(false);
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
    if (textref.current?.value !== prompt) {
      textref.current!.value = prompt;
    }
  }, [prompt])

  const handlesidebar = () => {
    setshowsidebar(!showsidebar);
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




  return (
    <>
      {/* {status === "loading" && <div className="fixed z-40 top-0">
        <Loading />
      </div>} */}
      {projecttoggle && !isSubmitted && <div className="dark:bg-dark-black/80 bg-light-grey/80  w-[100vw] fixed inset-0 z-20 flex items-end justify-center">
        <div className="bg-light-white py-8 md:py-4 px-5 flex flex-col justify-between  gap-5 bottom-[30%] shadow-md dark:bg-dark-input-outline border dark:border-dark-grey/20 border-light-mediumgrey rounded-md h-auto w-[25rem] lg:w-[35rem] absolute z-10">
          <div className="flex justify-end"><IoClose className="size-5 cursor-pointer" onClick={handleprojectclose} /></div>
          <div className="text-xl font-bold text-center">Enter Your Project Name</div>
          <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="projectName">Project Name : </label>
            <input type="text" id="projectName" {...register("projectName")} className="dark:bg-dark-input-box  border py-1 px-1 bg-light-mediumgrey border-light-grey dark:border-dark-grey/20 focus:outline-none rounded-md" />
            {errors.projectName && <span className="text-red-500">{errors.projectName.message}</span>}
            <input type="submit" value={isSubmitting ? 'Submitting' : 'Submit'} disabled={isSubmitting} className="p-2 disabled:dark:bg-dark-white/90 bg-light-black hover:bg-light-black/90 text-light-white dark:bg-dark-white cursor-pointer hover:dark:bg-dark-white/90 transition-all ease-in-out dark:text-dark-black font-bold rounded-md" />
          </form>
        </div>
      </div>}
      <div className="flex dark:bg-dark-mediumblack justify-around">
        <div className="lg:hidden fixed left-5 p-2 rounded-md hover:dark:bg-dark-white/90 dark:bg-dark-white cursor-pointer shadow-lg dark:text-dark-black" onClick={handlesidebar}><GiHamburgerMenu className="size-5" /></div>
        <div ref={sideref} className={`dark:bg-dark-input-outline w-[25rem] z-10 fixed h-[90vh] ${showsidebar ? `left-0` : `-left-100`} transition-all duration-500 ease-in-out lg:left-0 flex flex-col p-5 border dark:border-dark-grey/20 border-light-grey bg-light-lightgrey border-l-0 border-y-0 `}>
          <button className="p-2 dark:bg-dark-white bg-light-black text-light-white hover:bg-light-black/90 dark:text-dark-black font-bold rounded-md cursor-pointer  hover:dark:bg-dark-white/90 flex justify-center gap-2" onClick={handleproject}><FiPlus className="size-6" />Create new Project</button>
          <AnimatePresence mode="sync">
            <motion.div className="flex flex-col gap-5 mt-8">
              {projectdetails?.map((item, index) => {
                return <motion.div key={index} className="">
                  <button className="rounded-md w-[100%] flex items-center justify-between focus:outline-none cursor-pointer" id={item.projectName} >
                    <div className="w-full text-start" id={item.projectName} onClick={(e) => handleshowprompt(e)}>{item.projectName}</div>
                    <div className="flex gap-2 items-center">
                      <IoIosAdd className="size-6 dark:text-dark-white" id={item.projectName} onClick={(e) => handlenewprompt(e)} />
                      <IoIosArrowDown className={`size-4 transition-all ease-in-out ${showprompts?.projectName === item.projectName && showprompts.show ? 'rotate-180' : 'rotate-0'}`} id={item.projectName} onClick={(e) => handleshowprompt(e)} />
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
                          <div className={`${currentprompt?.id === prompt.id && currentprompt.projectName === item.projectName ? `bg-light-grey dark:bg-dark-input-box dark:text-dark-white text-light-black` : `hover:dark:bg-dark-input-box hover:bg-light-grey dark:text-dark-grey text-light-darkgrey hover:dark:text-dark-white hover:text-light-black`} transition-all ease-in-out rounded-md p-2 mt-3 cursor-pointer w-full`} id={item._id} onClick={(e) => handlecurrentprompt(e, prompt.id, item.projectName, prompt.text, prompt.code)}>
                            Blank Prompt
                          </div>
                          : <div className={`${currentprompt?.id === prompt.id && currentprompt.projectid === item._id ? `bg-light-grey dark:bg-dark-input-box dark:text-dark-white text-light-black` : `hover:dark:bg-dark-input-box hover:bg-light-grey dark:text-dark-grey text-light-darkgrey hover:dark:text-dark-white hover:text-light-black`} transition-all ease-in-out rounded-md p-2 mt-3 cursor-pointer w-full text-ellipsis whitespace-nowrap overflow-hidden`} id={item._id} onClick={(e) => handlecurrentprompt(e, prompt.id, item.projectName, prompt.text, prompt.code)}>
                            {prompt.text}
                          </div>}
                      </motion.div>
                    })
                  }
                </motion.div>
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-col xss:w-full md:w-[80vw] lg:w-fit lg:ml-[25rem] xl:ml-[20rem] gap-5 bg-light-white dark:bg-dark-mediumblack min-h-[90vh] p-5">
          <div className="bg-light-white dark:bg-dark-input-outline border border-light-grey dark:border-dark-grey/20 rounded-md h-[60vh] xss:h-[40vh] xl:h-[60vh] lg:w-[50vw] p-9 flex flex-col justify-between items-center">
            <div className="w-[100%] h-[100%] relative">
              <textarea ref={textref} className="bg-light-mediumgrey dark:bg-dark-input-box dark:border-dark-grey/20  border border-light-grey  w-[100%]  resize-none p-4 h-[100%] rounded-md focus:outline-none placeholder:xl:text-base xl:text-base xss:text-sm placeholder:xss:text-sm" placeholder="Describe your UI... e.g., a dashboard with 3 cards and a sidebar" />
              <button onClick={handletext} disabled={loading} className="bg-light-black text-light-white dark:bg-dark-white dark:border dark:border-dark-grey/20 hover:bg-light-black/90 hover:dark:bg-dark-white/90 dark:text-dark-black transition-all ease-in-out absolute bottom-5 right-5 px-8 py-3 lg:px-4 rounded-md  font-bold text-xl cursor-pointer  h-[7vh] lg:h-[5vh] xl:h-[6vh]  lg:w-[15vw] xl:w-[18vw] flex items-center lg:justify-center">
                {loading ? <div className="animate-spin inline-block lg:mr-5 xss:size-4 border-3 border-light-darkgrey dark:border-dark-grey  border-t-light-white dark:border-t-dark-black rounded-full " role="status" aria-label="loading">
                </div> : <FaArrowRight className="lg:hidden" />}<div className="hidden lg:flex lg:items-center lg:gap-10 lg:justify-center lg:text-base xl:text-lg">{loading ? <>Generating </> : <>Generate</>}</div></button>
            </div>
          </div>
          <div className=" bg-light-white dark:bg-dark-input-outline border border-light-grey dark:border-dark-grey/20 h-[60vh] lg:w-[50vw] rounded-md flex flex-col mb-10">
            <div className="flex h-[6.5vh] justify-between bg-darkgrey font-semibold border border-x-0 border-t-0 border-light-grey dark:border-dark-grey/20 items-center">
              <div className="xss:text-xs sm:text-sm flex items-center">
                <button className={onActive === "Preview" ? " border border-light-grey dark:border-dark-grey/20 h-[6.5vh] md:w-[6rem] xss:w-[5rem] cursor-pointer border-b-0" : "h-[6.5vh] md:w-[6rem] xss:w-[5rem] cursor-pointer text-light-darkgrey"} onClick={handlepreview}>Preview</button>
                <button className={onActive === "Code" ? "border border-light-grey dark:border-dark-grey/20 h-[6.5vh] md:w-[6rem] xss:w-[5rem] cursor-pointer border-b-0" : "h-[6.5vh] md:w-[6rem] xss:w-[5rem]  cursor-pointer text-light-darkgrey"} onClick={handlecode}>Code</button>
              </div>
              <div className="flex items-center gap-2 px-5 cursor-pointer sm:text-sm xss:text-xs" onClick={handlecopy}>
                {copycode ? <><LuCheck size={20} className="xss:size-4" /> Copied </> : <><LuCopy size={20} className="xss:size-4" /> Copy code </>}
              </div>
            </div>
            {onActive === "Preview" ?
              <>
                {/* Preview */}
                < div className=" h-[53.5vh] rounded-b-md bg-light-lightgrey dark:bg-dark-input-box overflow-auto">
                  {
                    jsxgeneratedcode ?
                      < iframe
                        className="w-full h-[53.5vh] border-0 transition-all ease-in-out"
                        srcDoc={`
                        <html>
                          <head>
                                  <script>
                                    document.addEventListener('click', (e) => {
                                      if(e.target.tagName === 'A') {
                                        e.preventDefault();
                                      }
                                    });
                                  </script>
                             <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                            </head>
                          <body>${jsxgeneratedcode}</body>
                        </html>
                      `}
                      />

                      : <div className="m-6 xss:text-sm sm:text-base">No preview to show.</div>
                  }
                </div>
              </>
              :
              <>
                {/* Code */}
                <div className={`h-[53.5vh] dark:bg-dark-input-box rounded-b-md ${iseditting ? 'overflow-hidden' : ''} bg-light-lightgrey relative`}>
                  {
                    jsxgeneratedcode.length === 0 ? <div className="m-6 xss:text-sm sm:text-base">No code to show.</div> : <>
                      {iseditting ? <div className="h-[53.5vh]">
                        <Editor
                          height="100%"
                          defaultLanguage="html"
                          value={jsxgeneratedcode}
                          theme={resolvedTheme === 'light' ? `vs-light` : `vs-dark`}
                          onChange={(value) => setjsxgeneratedcode(value!)}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                            scrollbar: {
                              vertical: 'hidden',
                              horizontal: 'visible'
                            },
                          }}
                        />
                        <button className="absolute top-3 right-3 bg-light-black hover:bg-light-black/80 dark:bg-dark-white dark:text-dark-black text-light-white px-3 py-2 rounded-md cursor-pointer transition-all ease-in-out hover:dark:bg-dark-white/90" onClick={() => setiseditting(false)}>Done</button>
                      </div> :
                        (<><div className="">
                          <Codeblock code={jsxgeneratedcode} language="jsx" />
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
