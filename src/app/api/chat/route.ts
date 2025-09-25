import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Generate a React component and css for the following UI prompt and seperate the code so that i can know the start and end of the code and the end should be #endjsxcode/#endcsscode for each and start of the code as jsxcode/csscode and remove other things. Only give code. Do not add explanation:\n${prompt}`
    })


    return NextResponse.json({ success: true, text }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }

}