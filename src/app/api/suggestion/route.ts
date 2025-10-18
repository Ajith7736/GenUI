import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const { text } = await generateText({
            model: groq("openai/gpt-oss-120b"),
            prompt: `You are a suggestion maker for my generative ui builder project.
                     prompt : '${prompt}'
                     User gives prompt and you just creates a suggestions in json format.
                     Suggestion should be in a form that it can be concatinated to the prompt string.
                     Suggestion must not include any feature that the user gave in the prompt.
                     Give atleast 3-2 suggestions
                     Dont add any extra text or something just give the json.
                     the suggestion should in way that it can be added to a code with html and tailwindcss only.
                     it must contain only 3-2 words max`
        })

        if (text) {
            return NextResponse.json({ message: "Prompt generated successfully", text }, { status: 200 })
        } else {
            return NextResponse.json({ message: "Couldn't generate the prompt" }, { status: 400 })
        }

    } catch (err) {
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}