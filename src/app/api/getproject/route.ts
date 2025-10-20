import connectdb from "@/db/connectdb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

interface promptprops {
    id: string,
    text: string,
    code: string
}

interface Projectprops {
    _id: string,
    userId: string,
    projectName: string,
    prompts: promptprops[] | null,
    createdAt: Date,
    UpdatedAt: Date
}

export async function POST(req: Request) {
    try {
        await connectdb();
        const { userId }: { userId: string } = await req.json();
        const projects: Projectprops[] | null = await Project.find({ userId }).sort({ UpdatedAt: -1 });
        if (projects) {
            return NextResponse.json({ success: true, projects }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: "There are no projects" }, { status: 400 })
        }
    } catch (err) {
        return NextResponse.json({ message: "Server error",err }, { status: 500 })
    }
}