import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Project from "@/models/Project";

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
        const { projectid, userId }: { projectid: string, userId: string } = await req.json();

        const deletedproject: promptprops | null = await Project.findOneAndDelete({ _id: projectid });

        if (!deletedproject) {
            return NextResponse.json({ message: "Couldn't delete the project" }, { status: 400 })
        }

        const updatedproject: Projectprops[] | null = await Project.find({ userId });

        if (updatedproject) {
            return NextResponse.json({ message: "successfully deleted ", updatedproject }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Something went wrong" })
        }

    } catch (err) {
        return NextResponse.json({ message: "server error", err }, { status: 500 });
    }
}