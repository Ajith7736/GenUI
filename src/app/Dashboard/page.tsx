"use client"

import { useRef, useState } from "react";
import { LuCopy } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import Codeblock from "@/components/Codeblock";
import { LuCheck } from "react-icons/lu";


function page() {

  const [onActive, setonActive] = useState<string | null>("Code")
  const textref = useRef<HTMLTextAreaElement | null>(null);
  const [jsxgeneratedcode, setjsxgeneratedcode] = useState<string>("")
  const [cssgeneratedcode, setcssgeneratedcode] = useState<string>("")
  const [codeshown, setcodeshown] = useState<string>("jsx")
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
      let jsxcode: string | null = await codeextrator("jsxcode", data.text);
      let csscode: string | null = await codeextrator("csscode", data.text)
      jsxcode && await setjsxgeneratedcode(jsxcode);
      csscode && await setcssgeneratedcode(csscode);
      setloading(false);
    } else if (res.status === 400 || res.status === 500) {
      setloading(false)
    }
  };

  const handletext = (): void => {
    textref.current?.value !== "" && generate(textref.current?.value!)
    textref.current && (textref.current.value = "");
  }

  const handlecopy = (): void => {
    setcopycode(true);
    navigator.clipboard.writeText(codeshown === "jsx" ? jsxgeneratedcode : cssgeneratedcode);
    toast.success("Code Copied to Clipboard");
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

  const handlejsxcodeshow = (): void => {
    setcodeshown("jsx");
  }

  const handlecsscodeshow = (): void => {
    setcodeshown("css");
  }


  return (
    <div className="lg:flex">

      <div className="bg-light-white m-5 border border-light-grey rounded-md h-[60vh] lg:w-[50vw] p-9 flex flex-col justify-between items-center">

        <div className="w-[100%] h-[100%] relative">
          <textarea ref={textref} className="bg-light-mediumgrey   border border-light-grey  w-[100%]  resize-none p-4 h-[100%] rounded-md focus:outline-none placeholder:text-lg text-lg" placeholder="Describe your UI... e.g., a dashboard with 3 cards and a sidebar" />
          <button onClick={handletext} className="bg-light-black text-light-white hover:bg-light-black/90 transition-all ease-in-out absolute bottom-5 right-5 px-8 py-3 rounded-md  font-bold text-xl cursor-pointer  h-[7vh]  lg:w-[20vw] flex items-center lg:justify-center">{loading ? <div className="animate-spin inline-block size-6 border-3 border-light-darkgrey  border-t-light-white rounded-full " role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div> : <FaArrowRight size="25" className="lg:hidden" />}<div className="hidden lg:flex lg:items-center lg:gap-10 lg:justify-center lg:text-lg xl:text-xl">{loading ? <>Generating.... </> : <>Generate Now</>}</div></button>
        </div>

      </div>

      <div className=" bg-light-white m-5 border border-light-grey h-[60vh] lg:w-[40vw] rounded-md ">
        <div className="flex justify-between bg-darkgrey font-semibold border border-x-0 border-t-0 border-light-grey">
          <div className="text-xl">
            <button className={onActive === "Preview" ? "border px-7 border-light-grey py-4 cursor-pointer border-b-0 rounded-tl-md" : " px-7  py-4 cursor-pointer border-b-0 text-light-darkgrey rounded-tl-md"} onClick={handlepreview}>Preview</button>
            <button className={onActive === "Code" ? "border border-light-grey px-9 py-4 cursor-pointer border-b-0" : " px-9 py-4 cursor-pointer border-b-0 text-light-darkgrey"} onClick={handlecode}>Code</button>
          </div>
          <div className="flex items-center gap-2 px-5 cursor-pointer" onClick={handlecopy}>
            {copycode ? <><LuCheck size={20} /> Copied </> : <><LuCopy size={20} /> Copy code </>}
          </div>
        </div>

        {onActive === "Preview" ?
          <>
            {/* Preview */}
            < div className=" h-[52vh] p-5 rounded-b-md">
              Preview
            </div>
          </>
          :
          <>
            {/* Code */}
            <div className=" h-[52vh] rounded-b-md overflow-auto">
              {
                jsxgeneratedcode.length === 0 ? <div className="m-6">No code to show.</div> : <>
                  {
                    (jsxgeneratedcode || cssgeneratedcode) && <div className="h-[10%] bg-light-mediumgrey border border-x-0 border-t-0 flex items-center border-light-grey">
                      {jsxgeneratedcode && <div className={codeshown === "jsx" ? "cursor-pointer border py-3 px-10 border-t-0 border-x-0 transition-all ease-in-out" : "cursor-pointer py-3 px-10 text-grey"} onClick={handlejsxcodeshow}>jsx</div>}
                      {cssgeneratedcode && <div className={codeshown === "css" ? "cursor-pointer border py-3 px-10 border-t-0 border-x-0" : "cursor-pointer py-3 px-10 text-grey"} onClick={handlecsscodeshow}>css</div>}
                    </div>
                  }
                  <div className="mx-5">
                    {
                      codeshown === "jsx" ?
                        <Codeblock code={jsxgeneratedcode} language="jsx" />
                        :
                        <Codeblock code={cssgeneratedcode} language="css" />

                    }

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
