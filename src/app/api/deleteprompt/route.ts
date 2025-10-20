import Project from "@/models/Project";
import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";

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

export async function DELETE(req: Request) {
    try {
        await connectdb();
        const { projectid, promptid }: { projectid: string, promptid: string } = await req.json();
       
        const updatedproject : Projectprops[] | null = await Project.findOneAndUpdate(
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