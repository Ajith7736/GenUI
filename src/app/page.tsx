"use client"
import Image from "next/image";
import { useRef, useState } from "react";
import { LuCopy } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  const [onActive, setonActive] = useState<string | null>("Preview")
  const textref = useRef<HTMLTextAreaElement | null>(null);
  const [generatedcode, setgeneratedcode] = useState("")

  const handlepreview = (): void => {
    setonActive("Preview")
  }

  const handlecode = (): void => {
    setonActive("Code")
  }

  const generate = async (value: string) => {
    let res = await fetch("/api/generate-ui", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: value })
    });

    if(!res.body) return;

    
    
  }

  const handletext = (): void => {
    generate(textref.current?.value!)
    textref.current && (textref.current.value = "");
  }

  return (
    <div className="lg:flex">

      <div className="bg-darkgrey m-5 border border-gray-800 rounded-md h-[60vh] lg:w-[50vw] p-9 flex flex-col justify-between items-center">

        <div className="w-[100%] h-[100%] relative">
          <textarea ref={textref} className="bg-black border border-gray-800 w-[100%]  resize-none p-4 h-[100%] rounded-md focus:outline-none placeholder:text-lg  text-lg" placeholder="Describe your UI... e.g., a dashboard with 3 cards and a sidebar" />
          <button onClick={handletext} className="bg-purple absolute bottom-5 right-5 px-8 py-3 rounded-md font-extrabold text-xl cursor-pointer hover:bg-purple/90  h-[7vh]  lg:w-[20vw]"><FaArrowRight size="25" className="lg:hidden" /><div className="hidden lg:flex lg:items-center lg:gap-10 lg:justify-center">Generate Now</div></button>
        </div>

      </div>

      <div className="bg-black m-5 border border-gray-800 h-[60vh] lg:w-[50vw] rounded-md ">

        <div className="flex justify-between bg-darkgrey font-semibold border border-x-0 border-t-0 border-gray-700">
          <div className="text-xl">
            <button className={onActive === "Preview" ? "border px-7 border-gray-700 py-4 cursor-pointer border-b-0 rounded-tl-md" : " px-7  py-4 cursor-pointer border-b-0 rounded-tl-md"} onClick={handlepreview}>Preview</button>
            <button className={onActive === "Code" ? "border border-gray-700 px-9 py-4 cursor-pointer border-b-0" : " px-9 py-4 cursor-pointer border-b-0"} onClick={handlecode}>Code</button>
          </div>
          <div className="flex items-center gap-2 px-5 cursor-pointer">
            <LuCopy size={20} /> Copy Code
          </div>
        </div>

        {onActive === "Preview" ?
          <>
            {/* Preview */}
            < div className=" h-[52vh] p-5 rounded-b-md">
              This is preview
            </div>
          </>
          :
          <>
            {/* Code */}
            <div className=" h-[52vh] p-5 rounded-b-md">
              This is Code
            </div>
          </>
        }


        <div>

        </div>
      </div>
    </div >
  );
}
