import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Generate a React component for the following UI prompt. Only give code. Do not add explanation:\n${prompt}`
    })

    console.log(text);

    return NextResponse.json({ success: true, text }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }

}