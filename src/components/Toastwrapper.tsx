"use client"
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { useTheme } from 'next-themes'

function Toastwrapper() {

    const { resolvedTheme } = useTheme();

    return (
        <Toaster position="top-right" reverseOrder={false} toastOptions={{
            className: '',
            style: {
                background: resolvedTheme === "dark" ? "#1C2029" : "white",
                color: resolvedTheme === "dark" ? "white" : "black",
                border: resolvedTheme === "dark" ? "1px solid rgba(15, 23, 42, 0.5)" : "1px solid rgba(15, 23, 42,0.5)"
            }
        }} />
    )
}

export default Toastwrapper
