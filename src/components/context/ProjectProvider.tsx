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
    setprojectdetails: React.Dispatch<React.SetStateAction<Project[] | null>>
}

const ProjectContext = createContext<ProjectContextprops | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    const [projectdetails, setprojectdetails] = useState<Project[] | null>(null);
    return (
        <ProjectContext.Provider value={{ projectdetails, setprojectdetails }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);

    if (context === undefined) {
        throw new Error("Useproject must be used inside the provider");
    }

    return context;
}