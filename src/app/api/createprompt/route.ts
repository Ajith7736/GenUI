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
        const { prompt, projectid }: { prompt: promptprops, projectid: string } = await req.json();

        const updatedproject = await Project.findOneAndUpdate(
            { _id: projectid, "prompts.id": prompt.id },
            {
                $set: { "prompts.$.text": prompt.text, "prompts.$.code": prompt.code }
            }, { new: true }
        )

        if (updatedproject) {
            return NextResponse.json({ message: "Successfully updated", updatedproject }, { status: 200 })
        }

        const pushedproject = await Project.findOneAndUpdate(
            { _id: projectid },
            {
                $push: { prompts: { id: prompt.id, text: prompt.text, code: prompt.code } },
            }, { new: true }
        )

        if (!pushedproject) {
            return NextResponse.json({ message: "project Not found" }, { status: 404 })
        }


        return NextResponse.json({ message: "Updated successfully", updatedproject : pushedproject }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}