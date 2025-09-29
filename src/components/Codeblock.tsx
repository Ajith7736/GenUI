"use client"
import React from 'react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Codeblockprops {
    code: string,
    language: string
}


function Codeblock({ code, language }: Codeblockprops) {
    return (
        <div>
            <SyntaxHighlighter
                language={language}
                style={oneLight}
                customStyle={{
                    background: "transparent",
                    padding: 2
                }}
                lineProps={{
                    style: {
                        background: "white"
                    }
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div >
    )
}

export default Codeblock
