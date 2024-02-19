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
        <div>DashboardPage
            <button className="bg-red-500 text-white px-4 py-2 block" onClick={() => {signOut()}}>Cerrar sesión</button>
            <button id="profileButton" onClick={() => {irAPerfil()}}>Ir al Perfil</button>
            <CalendarTest/>
        </div>
    )
}

function irAPerfil() {
    window.location.href = '/profile'; 
  }

export default DashboarPage