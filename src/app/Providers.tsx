"use client"

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { Notifications } from "react-push-notification-18";
//https://nextui.org/docs/frameworks/nextjs#pages-directory-setup
interface Props{
    children: React.ReactNode
}
//Posiciones posibles para notificaciones:
//top-left, top-middle, top-right, bottom-left, bottom-middle, bottom-right.
//https://www.npmjs.com/package/react-push-notification
function Providers({children}: Props){
    return <NextUIProvider><SessionProvider><Notifications position="top-right" />{children}</SessionProvider></NextUIProvider>;
}
export default Providers