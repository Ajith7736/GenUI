"use client"

import React from 'react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from 'next-themes';
import { useProject } from './context/ProjectProvider';

interface Codeblockprops {
    language: string
}


function Codeblock({ language }: Codeblockprops) {
    const { jsxgeneratedcode } = useProject()
    const { resolvedTheme } = useTheme();

    return (
        <div >
            {/* Syntax highlighter for highlighting the code */}
            <SyntaxHighlighter
                language={language}
                style={resolvedTheme === 'light' ? oneLight : oneDark}
                customStyle={{
                    height: "53.5vh",
                    width: "100%",
                    margin: 0
                }}
            >

                {jsxgeneratedcode}
            </SyntaxHighlighter>
        </div >
    )
}

export default Codeblock
