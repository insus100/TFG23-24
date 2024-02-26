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