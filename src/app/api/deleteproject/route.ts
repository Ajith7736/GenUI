import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb";
import Project from "@/models/Project";

export async function DELETE(req: Request) {
    try {
        await connectdb();
        const { projectid }: { projectid: string } = await req.json();

        const deletedproject = await Project.findOneAndDelete({ _id: projectid });

        if (!deletedproject) {
            return NextResponse.json({ message: "Couldn't delete the project" }, { status: 400 })
        }

        const updatedproject = await Project.find();
        if (updatedproject) {
            return NextResponse.json({ message: "successfully deleted ", updatedproject }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Somethig went wrong" })
        }

    } catch (err) {
        return NextResponse.json({ message: "server error" }, { status: 500 });
    }
}