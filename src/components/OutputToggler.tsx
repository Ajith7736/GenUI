import React from 'react'
import { LuCheck, LuCopy } from 'react-icons/lu';

interface props {
    onActive: string,
    setonActive: React.Dispatch<React.SetStateAction<string>>,
    setcopycode: React.Dispatch<React.SetStateAction<boolean>>,
    copycode: boolean,
    jsxgeneratedcode: string
}

function OutputToggler({ onActive, setonActive, setcopycode, copycode, jsxgeneratedcode }: props) {

    const handlecopy = (): void => {
        setcopycode(true);
        navigator.clipboard.writeText(jsxgeneratedcode);
        setTimeout(() => {
            setcopycode(false)
        }, 2000);
    }

    console.log(onActive);

    return (
        <div className="flex h-[6.5vh] justify-between bg-darkgrey font-semibold border border-x-0 border-t-0 border-light-grey dark:border-dark-grey/20 items-center">
            <div className="xss:text-xs sm:text-sm flex items-center">
                <button className={onActive === "Preview" ? " border border-light-grey dark:border-dark-grey/20 h-[6.5vh] md:w-[6rem] xss:w-[5rem] cursor-pointer border-b-0" : "h-[6.5vh] md:w-[6rem] xss:w-[5rem] cursor-pointer text-light-darkgrey"} onClick={() => setonActive("Preview")}>Preview</button>
                <button className={onActive === "Code" ? "border border-light-grey dark:border-dark-grey/20 h-[6.5vh] md:w-[6rem] xss:w-[5rem] cursor-pointer border-b-0" : "h-[6.5vh] md:w-[6rem] xss:w-[5rem]  cursor-pointer text-light-darkgrey"} onClick={() => setonActive("Code")}>Code</button>
            </div>
            <div className="flex items-center gap-2 px-5 cursor-pointer sm:text-sm xss:text-xs" onClick={handlecopy}>
                {copycode ? <><LuCheck size={20} className="xss:size-4" /> Copied </> : <><LuCopy size={20} className="xss:size-4" /> Copy code </>}
            </div>
        </div>
    )
}

export default OutputToggler
