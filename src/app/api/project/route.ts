import Project from "@/models/Project";
import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";

interface Formvalue {
    userId: string,
    projectName: string,
}

export async function POST(req: Request) {
    try {
        await connectdb();
        let data: Formvalue = await req.json();
        const project = await Project.create({ userId: data.userId, projectName: data.projectName })
        if (project) {
            return NextResponse.json({ message: "Project added", project }, { status: 200 })
        } else {
            return NextResponse.json({ message: "Failed to add project" }, { status: 400 })
        }
    } catch (err) {
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}