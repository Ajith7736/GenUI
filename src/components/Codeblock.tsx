"use client"

import React from 'react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from 'next-themes';

interface Codeblockprops {
    code: string,
    language: string
}


function Codeblock({ code, language }: Codeblockprops) {
    const { resolvedTheme } = useTheme();
    return (
        <div >
            <SyntaxHighlighter
                language={language}
                style={resolvedTheme === 'light' ? oneLight : oneDark}
                customStyle={{
                    height: "53.5vh",
                    width: "100%",
                    margin: 0
                }}
            >

                {code}
            </SyntaxHighlighter>
        </div >
    )
}

export default Codeblock
