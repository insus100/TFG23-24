"use client"
import { useEffect, useState } from "react";
import {signOut, useSession} from 'next-auth/react'
import { useRouter } from "next/navigation";
import CalendarTest from "../calendartest/page";
import { Button, Modal, useDisclosure } from '@nextui-org/react';
import EventModal from './eventModal'
import axios from 'axios';
import Event from "@/models/event";



function DashboarPage(){
    //const _status = await getServerSession(authOptions)
    const{data: session, status} = useSession()
    const [events, setEvents] = useState([]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const router = useRouter();



    console.log(`session:`, session, `\nstatus:`, status);
    if(status === 'unauthenticated') {
        console.log("redirect to register");
        //return redirect('/login');
    }



    useEffect(() => {
        (async () => {
            const events = await axios.get('/api/events/createEvent');
            console.log("events", events);
        })()
    }, []);

    
    /*useEffect(() => {
        (async () => {
          try {
            const response = await axios.get('/api/events/createEvent');
            console.log("events", response);
            const fetchedEvents = response.data; // Asegúrate de que la respuesta contenga los eventos
            const formattedEvents = fetchedEvents.map(event => ({
              title: event.title,
              start: new Date(event.start), // Asegúrate de que el formato sea adecuado
              end: new Date(event.end),     // Asegúrate de que el formato sea adecuado
            }));
            setEvents(formattedEvents);
          } catch (error) {
            console.error("Error al obtener eventos:", error);
          }
        })();
      }, []);*/
    
    const irAPerfil = () => {
        return router.push('/profile')
    };

    return(
        <div>DashboardPage
            <Button color="danger" className="block px-4 py-2" onClick={() => {signOut()}}>
                Cerrar sesión
            </Button>
            <Button color="primary" id="profileButton" onPress={() => {irAPerfil()}}>
                Ir al Perfil
            </Button>
            <Button onPress={onOpen} className="bg-green-500 text-white px-4 py-2 block mt-4">
                Agregar Evento al Calendario
            </Button>
            <CalendarTest events={events} />
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <EventModal />
            </Modal>
        </div>
    )
}

export default DashboarPage