"use client"

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
//https://nextui.org/docs/frameworks/nextjs#pages-directory-setup
interface Props{
    children: React.ReactNode
}

function Providers({children}: Props){
    return <NextUIProvider><SessionProvider>{children}</SessionProvider></NextUIProvider>;
}
export default Providers