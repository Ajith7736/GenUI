'use client'

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { ReactElement } from "react";


export default function NavbarWrapper(): ReactElement | null {
    const pathname = usePathname();
    const nonavbarpath = ["/Login","/Signup"];
    const shownavbar = !nonavbarpath.includes(pathname)

    return shownavbar ? <Navbar /> : null;
}