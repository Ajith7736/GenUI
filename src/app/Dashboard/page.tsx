"use client"

import { useRef, useState } from "react";
import { LuCopy } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import Codeblock from "@/components/Codeblock";
import { LuCheck } from "react-icons/lu";
import { LiveProvider, LivePreview, LiveEditor, LiveError } from "react-live";


function page() {

  const [onActive, setonActive] = useState<string | null>("Code")
  const textref = useRef<HTMLTextAreaElement | null>(null);
  const [jsxgeneratedcode, setjsxgeneratedcode] = useState<string>("")
  const [loading, setloading] = useState<boolean>(false)
  const [copycode, setcopycode] = useState<boolean>(false)

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
    <div className="lg:flex">

      <div className="bg-light-white m-5 border border-light-grey rounded-md h-[60vh] xss:h-[40vh] xl:h-[60vh] lg:w-[50vw] p-9 flex flex-col justify-between items-center">

        <div className="w-[100%] h-[100%] relative">
          <textarea ref={textref} className="bg-light-mediumgrey   border border-light-grey  w-[100%]  resize-none p-4 h-[100%] rounded-md focus:outline-none placeholder:xl:text-lg xl:text-lg xss:text-sm placeholder:xss:text-sm" placeholder="Describe your UI... e.g., a dashboard with 3 cards and a sidebar" />
          <button onClick={handletext} className="bg-light-black text-light-white hover:bg-light-black/90 transition-all ease-in-out absolute bottom-5 right-5 px-8 py-3 rounded-md  font-bold text-xl cursor-pointer  h-[7vh]  lg:w-[20vw] flex items-center lg:justify-center">
            {loading ? <div className="animate-spin inline-block lg:mr-5 size-6 border-3 border-light-darkgrey  border-t-light-white rounded-full " role="status" aria-label="loading">
            </div> : <FaArrowRight className="lg:hidden" />}<div className="hidden lg:flex lg:items-center lg:gap-10 lg:justify-center lg:text-lg xl:text-xl">{loading ? <>Generating </> : <>Generate Now</>}</div></button>
        </div>

      </div>

      <div className=" bg-light-white m-5 border border-light-grey h-[60vh] lg:w-[40vw] rounded-md flex flex-col justify-end mb-10">
        <div className="flex justify-between bg-darkgrey font-semibold border border-x-0 border-t-0 border-light-grey">
          <div className="xss:text-xs sm:text-sm">
            <button className={onActive === "Preview" ? "border px-7 xss:px-3 border-light-grey py-4  cursor-pointer border-b-0  rounded-tl-md" : " px-7 xss:px-3  py-4 cursor-pointer border-b-0 text-light-darkgrey rounded-tl-md"} onClick={handlepreview}>Preview</button>
            <button className={onActive === "Code" ? "border border-light-grey px-9 xss:px-4 py-4 cursor-pointer border-b-0" : " px-9 xss:px-4 py-4 cursor-pointer border-b-0 text-light-darkgrey"} onClick={handlecode}>Code</button>
          </div>
          <div className="flex items-center gap-2 px-5 cursor-pointer sm:text-sm xss:text-xs" onClick={handlecopy}>
            {copycode ? <><LuCheck size={20} className="xss:size-4" /> Copied </> : <><LuCopy size={20} className="xss:size-4" /> Copy code </>}
          </div>
        </div>

        {onActive === "Preview" ?
          <>
            {/* Preview */}
            < div className=" h-[53.5vh] rounded-b-md bg-light-lightgrey overflow-auto">
              {
                jsxgeneratedcode ?
                  < iframe
                    className="w-full h-[53.5vh] border-0 rounded-md"
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
            <div className=" h-[53.5vh] rounded-b-md overflow-auto bg-light-lightgrey">
              {
                jsxgeneratedcode.length === 0 ? <div className="m-6 xss:text-sm sm:text-base">No code to show.</div> : <>
                  <div className="mt-0">
                    <Codeblock code={jsxgeneratedcode} language="jsx" />
                  </div>
                </>
              }
            </div>
          </>
        }
        <div>
        </div>
      </div>
    </div >
  )
}

export default page
