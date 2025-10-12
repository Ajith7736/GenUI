import connectdb from "@/db/connectdb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

interface promptprops {
    id: string,
    text: string,
    code: string
}

export async function POST(req: Request) {
    try {
        connectdb();
        const { prompt, projectid }: { prompt: promptprops, projectid: string } = await req.json();

        const updatedproject = await Project.findOneAndUpdate(
            { _id: projectid },
            {
                $push: { prompts: { id: prompt.id, text: prompt.text, code: prompt.code } },
            }, { new: true }
        )

        if (!updatedproject) {
            return NextResponse.json({ message: "No prompt or project found" }, { status: 400 })
        }


        return NextResponse.json({ message: "Updated successfully", updatedproject }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}