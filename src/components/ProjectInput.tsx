import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';


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

interface ProjectInputProps {
    setprojectdetails: React.Dispatch<React.SetStateAction<Project[] | null>>;
    projecttoggle: boolean;
    setprojecttoggle: React.Dispatch<React.SetStateAction<boolean>>;
}

function Projectinput({ setprojectdetails, projecttoggle, setprojecttoggle }: ProjectInputProps) {

    interface Formvalue {
        projectName: string;
    }

    const { data: session }: { data: Session | null } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Formvalue>()
    const onSubmit: SubmitHandler<Formvalue> = async (data) => {
        await delay();
        addproject(data);
    }

    const delay = (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        })
    }


    const addproject = async (data: Formvalue) => {
        try {
            setprojecttoggle(true);
            const res = await fetch("/api/project",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    }, body: JSON.stringify({ ...data, userId: session?.user.id })
                })
            const resdata = await res.json()
            if (res.status === 200) {
                setprojectdetails(prev => prev ? [...prev, resdata.project] : [resdata.project])
                setprojecttoggle(false);
                localStorage.removeItem(`projects_${session?.user?.id}`);
            } else if (res.status >= 400) {
                toast.error("Project Already Exists")
            }
        } catch (err) {
            console.error(err);
            toast.error("Server Error")
        }
    }

    const handleprojectclose = () => {
        setprojecttoggle(false);
    }


    return (
        <>
            {projecttoggle && <div className="dark:bg-dark-black/80 bg-light-grey/80  w-[100vw] fixed inset-0 z-20 flex items-end justify-center">
                <div className="bg-light-white py-8 md:py-4 px-5 flex flex-col justify-between  gap-5 bottom-[30%] shadow-md dark:bg-dark-input-outline border dark:border-dark-grey/20 border-light-mediumgrey rounded-md h-auto w-[25rem] lg:w-[35rem] absolute z-10">
                    <div className="flex justify-end"><IoClose className="size-5 cursor-pointer" onClick={handleprojectclose} /></div>
                    <div className="text-xl font-bold text-center">Enter Your Project Name</div>
                    <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="projectName">Project Name : </label>
                        <input type="text" id="projectName" {...register("projectName", {
                            required: { value: true, message: "This field is required!" },
                            pattern: { value: /^[^\s]+$/, message: "Whitespace not allowed" }
                        })} className="dark:bg-dark-input-box  border py-1 px-1 bg-light-mediumgrey border-light-grey dark:border-dark-grey/20 focus:outline-none rounded-md" />
                        {errors.projectName && <span className="text-red-500">{errors.projectName.message}</span>}
                        <input type="submit" value={isSubmitting ? 'Submitting' : 'Submit'} disabled={isSubmitting} className="p-2 disabled:dark:bg-dark-white/90 bg-light-black hover:bg-light-black/90 text-light-white dark:bg-dark-white cursor-pointer hover:dark:bg-dark-white/90 transition-all ease-in-out dark:text-dark-black font-bold rounded-md" />
                    </form>
                </div>
            </div>}
        </>
    )
}

export default Projectinput
