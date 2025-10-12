import connectdb from "@/db/connectdb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectdb();
        let { userId }: { userId: string } = await req.json();
        let projects = await Project.find({ userId }).sort({ UpdatedAt: -1 });
        if (projects) {
            return NextResponse.json({ success: true, projects }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: "There are no projects" }, { status: 400 })
        }
    } catch (err) {
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}