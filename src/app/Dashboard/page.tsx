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
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";


function page() {

  const [onActive, setonActive] = useState<string | null>("Code")
  const textref = useRef<HTMLTextAreaElement | null>(null);
  const [jsxgeneratedcode, setjsxgeneratedcode] = useState<string>("")
  const [loading, setloading] = useState<boolean>(false)
  const [copycode, setcopycode] = useState<boolean>(false)
  const { data: session, status }: { data: Session | null, status: "loading" | "unauthenticated" | "authenticated" } = useSession();
  const router: AppRouterInstance = useRouter();
  const [iseditting, setiseditting] = useState<Boolean>(false)
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/")
    }
  }, [status, router]);

  if (status === "loading") return <div className="fixed z-2 top-0">
    <Loading />
  </div>;
  if (!session) return null;


  const handlepreview = (): void => {
    setonActive("Preview")
  }

  const handlecode = (): void => {
    setonActive("Code")
  }

  const generate = async (value: string) => {
    setloading(true)
    let res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: value })
    });

    let data = await res.json();

    if (res.status === 200) {
      let jsxcode: string | null = await codeextrator("htmlcode", data.text);
      jsxcode && await setjsxgeneratedcode(jsxcode);
      setloading(false);
    } else if (res.status === 400 || res.status === 500) {
      setloading(false)
    }
  };

  const handletext = (): void => {
    textref.current?.value !== "" && generate(textref.current?.value!)
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
    console.log(enddelimeter);


    let startindex: number = code.indexOf(startdelimeter);
    console.log(startindex);

    let endindex: number = code.indexOf(enddelimeter);

    if (startindex !== -1 && endindex !== -1) {
      let adjustedindex: number = startindex + startdelimeter.length;
      let extractedcode: string = code.slice(adjustedindex, endindex);
      return extractedcode;
    } else {
      return null;
    }
  }




  return (
    <>
      <div className="lg:flex">
        <div className="bg-light-white dark:bg-dark-input-outline m-5 border border-light-grey dark:border-dark-grey/20 rounded-md h-[60vh] xss:h-[40vh] xl:h-[60vh] lg:w-[50vw] p-9 flex flex-col justify-between items-center">
          <div className="w-[100%] h-[100%] relative">
            <textarea ref={textref} className="bg-light-mediumgrey dark:bg-dark-input-box dark:border-dark-grey/20  border border-light-grey  w-[100%]  resize-none p-4 h-[100%] rounded-md focus:outline-none placeholder:xl:text-base xl:text-base xss:text-sm placeholder:xss:text-sm" placeholder="Describe your UI... e.g., a dashboard with 3 cards and a sidebar" />
            <button onClick={handletext} className="bg-light-black text-light-white dark:bg-dark-white dark:border dark:border-dark-grey/20 hover:bg-light-white/90 dark:text-dark-black transition-all ease-in-out absolute bottom-5 right-5 px-8 py-3 rounded-md  font-bold text-xl cursor-pointer  h-[7vh]  lg:w-[20vw] flex items-center lg:justify-center">
              {loading ? <div className="animate-spin inline-block lg:mr-5 xss:size-4 border-3 border-light-darkgrey dark:border-dark-white  border-t-light-white dark:border-t-dark-black rounded-full " role="status" aria-label="loading">
              </div> : <FaArrowRight className="lg:hidden" />}<div className="hidden lg:flex lg:items-center lg:gap-10 lg:justify-center lg:text-lg">{loading ? <>Generating </> : <>Generate Now</>}</div></button>
          </div>
        </div>
        <div className=" bg-light-white dark:bg-dark-input-outline m-5 border border-light-grey dark:border-dark-grey/20 h-[60vh] lg:w-[40vw] rounded-md flex flex-col justify-end mb-10">
          <div className="flex justify-between bg-darkgrey font-semibold border border-x-0 border-t-0 border-light-grey dark:border-dark-grey/20">
            <div className="xss:text-xs sm:text-sm">
              <button className={onActive === "Preview" ? "border px-7 xss:px-3 border-light-grey dark:border-dark-grey/20 py-4  cursor-pointer border-b-0  rounded-tl-md" : " px-7 xss:px-3  py-4 cursor-pointer border-b-0 text-light-darkgrey rounded-tl-md"} onClick={handlepreview}>Preview</button>
              <button className={onActive === "Code" ? "border border-light-grey dark:border-dark-grey/20 px-9 xss:px-4 py-4 cursor-pointer border-b-0" : " px-9 xss:px-4 py-4 cursor-pointer border-b-0 text-light-darkgrey"} onClick={handlecode}>Code</button>
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
                            <script src="https://cdn.tailwindcss.com"></script>
                                  <script>
                                    document.addEventListener('click', (e) => {
                                      if(e.target.tagName === 'A') {
                                        e.preventDefault();
                                      }
                                    });
                                  </script>

                            </head>
                          <body>${jsxgeneratedcode}</body>
                        </html>
                      `}
                    />

                    : <div className="m-5 xss:text-sm sm:text-base">No preview to show.</div>
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
    </>

  )
}

export default page
