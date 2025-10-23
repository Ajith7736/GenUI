"use client"
import React, { createContext, ReactNode, useContext, useState } from 'react'

interface Project {
    _id: string,
    userId: string,
    projectName: string,
    prompts: prompts[] | null,
    createdAt: Date,
    UpdatedAt: Date
}

interface prompts {
    id: string,
    text: string,
    code: string,
    createdAt: Date
}

interface ProjectContextprops {
    projectdetails: Project[] | null,
    setprojectdetails: React.Dispatch<React.SetStateAction<Project[] | null>>,
    prompt: string,
    setprompt: React.Dispatch<React.SetStateAction<string>>,
    jsxgeneratedcode: string,
    setjsxgeneratedcode: React.Dispatch<React.SetStateAction<string>>,

}

const ProjectContext = createContext<ProjectContextprops | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    const [projectdetails, setprojectdetails] = useState<Project[] | null>(null);
    const [prompt, setprompt] = useState<string>("")
    const [jsxgeneratedcode, setjsxgeneratedcode] = useState<string>("")
    return (
        <ProjectContext.Provider value={{ projectdetails, setprojectdetails, prompt, setprompt, jsxgeneratedcode, setjsxgeneratedcode }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {

    // return useProject for direct use rather than calling it useContext(ProjectContext)

    const context = useContext(ProjectContext);

    if (context === undefined) {
        throw new Error("Useproject must be used inside the provider");
    }

    return context;
}