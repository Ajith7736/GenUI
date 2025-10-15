import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Project from "@/models/Project";

export async function POST(req: Request) {
    try {
        await connectdb();
        const { projectid }: { projectid: string } = await req.json();

        const updatedproject = await Project.findOneAndDelete({ _id: projectid }, { new: true });

        if (updatedproject) {
            return NextResponse.json({ message: "Successfully deleted" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Couldn't delete" }, { status: 400 })
        }

    } catch (err) {
        return NextResponse.json({ message: "server error" }, { status: 500 });
    }
}