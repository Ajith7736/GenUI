import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowRight } from 'react-icons/fa'
import { WiStars } from "react-icons/wi";

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

interface currentprompt {
    id: string,
    projectid: string,
    projectName: string,
    text: string,
    code: string
}

interface props {
    prompt: string,
    setprompt: React.Dispatch<React.SetStateAction<string>>,
    setjsxgeneratedcode: React.Dispatch<React.SetStateAction<string>>,
    currentprompt: currentprompt | null,
    setprojecttoggle: React.Dispatch<React.SetStateAction<boolean>>,
    setprojectdetails: React.Dispatch<React.SetStateAction<Project[] | null>>
}



function Promptinput({ prompt, setprompt, setjsxgeneratedcode, currentprompt, setprojecttoggle, setprojectdetails }: props) {
    const textref = useRef<HTMLTextAreaElement>(null);
    const [suggestion, setsuggestion] = useState<string[] | null>(null)
    const [suggesstionloader, setsuggesstionloader] = useState<boolean>(false)
    const [loading, setloading] = useState<boolean>(false)
    const { data: session } = useSession();
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

    useEffect(() => {
        if (textref.current?.value !== prompt) {
            textref.current!.value = prompt;
        }
    }, [prompt])

    const generate = async (prompt: string) => {
        setloading(true)
        try {
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
                toast.error(data.message)
                setloading(false)
            }
        } catch (err) {
            toast.error("Server Error");
            setloading(false);
        }
    };

    const generatesuggestions = async (prompt: string) => {
        try {
            setsuggesstionloader(true)
            let res = await fetch("/api/suggestion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            })
            let data = await res.json();
            if (res.status === 200) {
                setsuggestion((JSON.parse(data.text)).suggestions);
                setsuggesstionloader(false);
            } else if (res.status === 500 || res.status === 400) {
                toast.error(data.message);
                setsuggesstionloader(false);
            }
        } catch (err) {
            console.error(err)
            toast.error("Server error")
        }
    }


    const handletext = async (): Promise<void> => {
        if (textref.current?.value !== "") {
            if (currentprompt) {
                setprompt(textref.current?.value!);
                await generate(textref.current?.value!);
                await generatesuggestions(textref.current?.value!);
            } else {
                setprojecttoggle(true);
            }
        }
    }

    const addprompt = async (text: string, code: string) => {
        try {
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
                localStorage.removeItem(`projects_${session?.user.id}`);
            } else if (res.status >= 400) {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Server error");
        }
    }

    const handlesuggestion = (value: string) => {
        if (textref.current?.value === prompt) {
            setprompt(prompt + " \n" + value);
        } else {
            setprompt(textref.current?.value + " \n" + value);
        }
    }

    return (
        <div className="bg-light-white dark:bg-dark-input-outline border border-light-grey dark:border-dark-grey/20 rounded-md h-[60vh] xss:min-h-[45vh] xl:h-[60vh] lg:w-[50vw] p-2 flex flex-col justify-between gap-5">
            <div className="w-[100%] h-[100%] relative">
                <textarea ref={textref} className="bg-light-mediumgrey dark:bg-dark-input-box dark:border-dark-grey/20  border border-light-grey  w-[100%]  resize-none p-4 h-[100%] rounded-md focus:outline-none placeholder:xl:text-base xl:text-base xss:text-sm placeholder:xss:text-sm" placeholder="Describe your UI... e.g., a dashboard with 3 cards and a sidebar" />
                <button onClick={handletext} disabled={loading} className="bg-light-black text-light-white dark:bg-dark-white dark:border dark:border-dark-grey/20 hover:bg-light-black/90 hover:dark:bg-dark-white/90 dark:text-dark-black transition-all ease-in-out absolute bottom-5 right-5 px-8 py-3 lg:px-4 rounded-md  font-bold text-xl cursor-pointer  h-[7vh] lg:h-[5vh] xl:h-[6vh]  lg:w-[15vw] xl:w-[18vw] flex items-center lg:justify-center">
                    {loading ? <div className="animate-spin inline-block lg:mr-5 xss:size-4 border-3 border-light-darkgrey dark:border-dark-grey  border-t-light-white dark:border-t-dark-black rounded-full " role="status" aria-label="loading">
                    </div> : <FaArrowRight className="lg:hidden" />}<div className="hidden lg:flex lg:items-center lg:gap-10 lg:justify-center lg:text-base xl:text-lg">{loading ? <>Generating </> : <>Generate</>}</div></button>
            </div>
            {suggesstionloader && <div className='flex gap-5 flex-wrap p-2'>
                <div className='w-[13rem] h-1 dark:bg-dark-mediumgrey bg-light-mediumgrey rounded-full animate-pulse'></div>
                <div className='w-[13rem] h-1 dark:bg-dark-mediumgrey bg-light-mediumgrey rounded-full animate-pulse'></div>
                <div className='w-[13rem] h-1 dark:bg-dark-mediumgrey bg-light-mediumgrey rounded-full animate-pulse'></div>
            </div>}
            {!suggesstionloader && suggestion?.length! > 0 && <div className='flex gap-3 w-full flex-wrap'>
                {suggestion?.map((item, indx) => {
                    return <button key={indx} className='dark:bg-dark-input-box bg-light-lightgrey hover:bg-light-mediumgrey border-light-darkgrey/20 p-2 sm:min-w-[12rem] xss:text-xs sm:text-sm rounded-full flex items-center justify-center border dark:border-dark-grey/20 hover:dark:bg-dark-input-box/50 transition-all ease-in-out cursor-pointer' onClick={() => handlesuggestion(item)}>{item}</button>
                })}
            </div>}

        </div>
    )
}

export default Promptinput
