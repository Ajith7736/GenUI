import React from 'react'
import { useTheme } from 'next-themes'
import Editor from "@monaco-editor/react";
import { useProject } from './context/ProjectProvider';

interface props {
    setiseditting: React.Dispatch<React.SetStateAction<boolean>>
}

function CodeEditor({ setiseditting }: props) {
    const { jsxgeneratedcode, setjsxgeneratedcode } = useProject()
    const { resolvedTheme } = useTheme();

    return (
        <div className="h-[53.5vh]">
            {/* Editor for the code implemented using monaco editor */}
            <Editor
                height="100%"
                defaultLanguage="html"
                value={jsxgeneratedcode}
                theme={resolvedTheme === 'light' ? `vs-light` : `vs-dark`}
                onChange={(value) => setjsxgeneratedcode(value!)}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    scrollbar: {
                        vertical: 'hidden',
                        horizontal: 'visible'
                    },
                }}
            />
            <button className="absolute top-3 right-3 bg-light-black hover:bg-light-black/80 dark:bg-dark-white dark:text-dark-black text-light-white px-3 py-2 rounded-md cursor-pointer transition-all ease-in-out hover:dark:bg-dark-white/90" onClick={() => setiseditting(false)}>Done</button>
        </div>
    )
}

export default CodeEditor
