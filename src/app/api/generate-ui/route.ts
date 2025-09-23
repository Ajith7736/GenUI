import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";


export async function POST(req: Request) {
    const { prompt } = await req.json();

    const result = streamText({
        model: openai("chatgpt-4o-latest"),
        messages: [{
            role: 'user',
            content: `Generate a React component for the following UI prompt. Only give code. Do not add explanation:\n${prompt}`,
        }
        ]
    });

    return result.toUIMessageStreamResponse();
}

