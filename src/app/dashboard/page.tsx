"use client"
import { useEffect } from "react";
import {signOut, useSession} from 'next-auth/react'
import { redirect } from "next/navigation";
import CalendarTest from "../calendartest/page";

function DashboarPage(){
    //const _status = await getServerSession(authOptions)
    const{data: session, status} = useSession()

    console.log(`session:`, session, `\nstatus:`, status);
    if(status === 'unauthenticated') {
        console.log("redirect to register");
        //return redirect('/login');
    }
    return(
        <div>DashboarPage
            <button onClick={() => {signOut()}}>Cerrar sesión</button>
            <CalendarTest/>
        </div>
    )
}

export default DashboarPage