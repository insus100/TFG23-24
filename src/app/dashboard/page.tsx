"use client"
import { useEffect, useState } from "react";
import {signOut, useSession} from 'next-auth/react'
import { useRouter } from "next/navigation";
import CalendarTest from "../calendartest/page";
import { Button, Modal, useDisclosure } from '@nextui-org/react';
import EventModal from './eventModal'
import axios from 'axios';



function DashboarPage(){
    //const _status = await getServerSession(authOptions)
    const{data: session, status} = useSession()
    const [events, setEvents] = useState<{ title: string; start: Date; end: Date }[]>([]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const router = useRouter();

    // Obtener eventos al cargar la página
    useEffect(() => {
        (async () => {
            const events = await axios.get('/api/events/createEvent');
            console.log("events", events);
        })()
      }, []);

    console.log(`session:`, session, `\nstatus:`, status);
    if(status === 'unauthenticated') {
        console.log("redirect to register");
        //return redirect('/login');
    }

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