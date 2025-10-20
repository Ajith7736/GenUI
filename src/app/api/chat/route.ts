import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      prompt: `You are Generative UI Builder, an AI that generates responsive UI designs using Tailwind CSS for React developers. Generate only the <body> content (HTML inside the body tag) based on the following UI description.  
                Use Tailwind CSS classes only — no inline styles or JavaScript.  
                Do not include <html>, <head>, <script>, or any imports.  
                Mark the start of the generated code with 'htmlcode' and the end with '#endhtmlcode'.  
                Do not add explanations, backticks, comments, or any extra text.  
                Do not include href attributes in links.  
                \n${prompt}`
    })

    return NextResponse.json({ success: true, text }, { status: 200 })

  } catch (err) {
    return NextResponse.json({ success: false, message: "Server Error", err }, { status: 500 })
  }

}