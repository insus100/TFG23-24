"use client"

import {useSession} from 'next-auth/react'

function DashboarPage(){
    const{data: session, status} =  useSession()

    console.log(session, status);

    return(
        <div>DashboarPage</div>
    )
}

export default DashboarPage