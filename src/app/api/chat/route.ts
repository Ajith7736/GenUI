import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      prompt: `You are generative ui builder , Generate a HTML with tailwind css for the following UI prompt and seperate the code so that i can know the start and end of the code and the end should be #endhtmlcode ,start of the code should be htmlcode. Dont add anything else like backticks and all. Only give code and dont add js content it should only have html and tailwind css and dont add href to any link. Do not add any explanation just give the code so that i can show the code in code section:\n${prompt}`
    })


    return NextResponse.json({ success: true, text }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }

}