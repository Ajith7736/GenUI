import Project from "@/models/Project";
import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";

export async function DELETE(req: Request) {
    try {
        await connectdb();
        const { projectid, promptid }: { projectid: string, promptid: string } = await req.json();
        const updatedproject = await Project.findOneAndUpdate(
            { _id: projectid },
            { $pull: { prompts: { id: promptid } } },
            { new: true }
        );

        if (updatedproject) {
            return NextResponse.json({ message: "success", updatedproject }, { status: 200 });
        } else {
            return NextResponse.json({ message: "failed" }, { status: 400 });
        }

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}