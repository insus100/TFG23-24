"use client"
import { useEffect, useState } from "react";
import {signOut, useSession} from 'next-auth/react'
import CalendarTest from "../calendartest/page";
import { Button } from '@nextui-org/react';
import axios from 'axios';



function DashboarPage(){
    //const _status = await getServerSession(authOptions)
    const{data: session, status} = useSession()
    const [events, setEvents] = useState<{ title: string; start: Date; end: Date }[]>([]);

    useEffect(() => {
        // Obtener eventos al cargar la página
        axios.get('/api/auth/createEvent')
          .then((response) => setEvents(response.data))
          .catch((error) => console.error('Error fetching events:', error));
      }, []);

    console.log(`session:`, session, `\nstatus:`, status);
    if(status === 'unauthenticated') {
        console.log("redirect to register");
        //return redirect('/login');
    }



    const handleAddEvent = () => {
        // Agregar un nuevo evento y actualizar la lista de eventos
        axios.post('/api/auth/createEvent')
          .then((response) => setEvents([...events, response.data]))
          .catch((error) => console.error('Error adding event:', error));
      };

    return(
        <div>DashboardPage
            <button className="bg-red-500 text-white px-4 py-2 block" onClick={() => {signOut()}}>Cerrar sesión</button>
            <button id="profileButton" onClick={() => {irAPerfil()}}>Ir al Perfil</button>
            <Button onClick={handleAddEvent} className="bg-green-500 text-white px-4 py-2 block mt-4">
                Agregar Evento al Calendario
            </Button>
            <CalendarTest events={events} />
        </div>
    )
}

function irAPerfil() {
    window.location.href = '/profile'; 
  }

export default DashboarPage