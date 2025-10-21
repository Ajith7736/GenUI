"use client"

import { useEffect, useState } from "react";
import Codeblock from "@/components/Codeblock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Projectinput from "@/components/ProjectInput";
import Preview from "@/components/Preview";
import CodeEditor from "@/components/CodeEditor";
import Promptinput from "@/components/Promptinput";
import OutputToggler from "@/components/OutputToggler";
import Sidebar from "@/components/Sidebar";
import Loading from "@/components/Loading";



function Page() {

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
  const { status }: { status: "loading" | "unauthenticated" | "authenticated" } = useSession();
  const router: AppRouterInstance = useRouter();
  const [prompt, setprompt] = useState<string>("");
  const [iseditting, setiseditting] = useState<boolean>(false)
  const [projecttoggle, setprojecttoggle] = useState<boolean>(false);
  const [projectdetails, setprojectdetails] = useState<Project[] | null>(null)
  const [showprompts, setshowprompts] = useState<showprompt | null>({ projectName: null, show: false })
  const [currentprompt, setcurrentprompt] = useState<currentprompt | null>(null)
  const [deletetoggle, setdeletetoggle] = useState<deletetoggleprops | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/")
    }
  }, [status, router]);

  return (
    <>
      {status === "loading" && <div className="fixed z-40 top-0">
        <Loading />
      </div>}

      <Projectinput
        projecttoggle={projecttoggle}
        setprojecttoggle={setprojecttoggle}
        setprojectdetails={setprojectdetails}
      />

      <div className="flex dark:bg-dark-mediumblack justify-around">
        <Sidebar
          currentprompt={currentprompt}
          deletetoggle={deletetoggle}
          projectdetails={projectdetails}
          projecttoggle={projecttoggle}
          setcurrentprompt={setcurrentprompt}
          setdeletetoggle={setdeletetoggle}
          setjsxgeneratedcode={setjsxgeneratedcode}
          setprojectdetails={setprojectdetails}
          setprojecttoggle={setprojecttoggle}
          setprompt={setprompt}
          setshowprompts={setshowprompts}
          showprompts={showprompts}
        />

        <div className="flex flex-col xss:w-full md:w-[80vw] lg:w-fit lg:ml-100 xl:ml-80 gap-5 bg-light-white dark:bg-dark-mediumblack min-h-[90vh] p-5">

          <Promptinput
            prompt={prompt}
            setprompt={setprompt}
            currentprompt={currentprompt}
            setjsxgeneratedcode={setjsxgeneratedcode}
            setprojectdetails={setprojectdetails}
            setprojecttoggle={setprojecttoggle}
          />

          <div className=" bg-light-white dark:bg-dark-input-outline border border-light-grey dark:border-dark-grey/20 h-[60vh] lg:w-[50vw] rounded-md flex flex-col mb-10">
            <OutputToggler
              jsxgeneratedcode={jsxgeneratedcode}
              onActive={onActive}
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

export default Page;
