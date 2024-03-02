"use client"
import { useEffect, useState } from "react";
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";
import CalendarTest from "../calendartest/page";
import { Button, Modal, useDisclosure } from '@nextui-org/react';
import EventModal from './eventModal'
import ShowInfoModal from './showInfoModal'
import axios from 'axios';



function DashboarPage() {
  //const _status = await getServerSession(authOptions)
  const { data: session, status } = useSession()
  const [events, setEvents] = useState([]);
  const { isOpen: isEventModalOpen, onOpen: onEventModalOpen, onOpenChange: onEventModalOpenChange } = useDisclosure();
  const { isOpen: isInfoModalOpen, onOpen: onInfoModalOpen, onOpenChange: onInfoModalOpenChange } = useDisclosure();
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);




  console.log(`session:`, session, `\nstatus:`, status);
  if (status === 'unauthenticated') {
    console.log("redirect to register");
    //return redirect('/login');
  }

  interface EventData {
    _id: string;
    title: string;
    start: Date;
    end: Date;
    creator: any
  }


  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/events/createEvent');
        console.log("events", response);
        const fetchedEvents = response.data;
        const formattedEvents = fetchedEvents.map((event: EventData) => ({
          _id: event._id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          creator: event.creator
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    })();
  }, []);

  const irAPerfil = () => {
    return router.push('/profile')
  };

  const openEventInfoModal = (event: any) => {
    setSelectedEvent(event);
    onInfoModalOpen();
  }



  return (
    <div>DashboardPage
      <Button color="danger" className="block px-4 py-2" onClick={() => { signOut() }}>
        Cerrar sesión
      </Button>
      <Button color="primary" id="profileButton" onPress={() => { irAPerfil() }}>
        Ir al Perfil
      </Button>
      <Button onPress={onEventModalOpen} className="bg-green-500 text-white px-4 py-2 block mt-4">
        Agregar Evento al Calendario
      </Button>
      <div className='justify-center h-[calc(100vh-4rem)] flex items-center'>
        <CalendarTest
          events={events}
          openEventInfoModal={openEventInfoModal}
        />
      </div>
      <Modal
        isOpen={isInfoModalOpen}
        onOpenChange={onInfoModalOpenChange}
        placement="top-center"
      >
        {selectedEvent && (
          <ShowInfoModal selectedEvent={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </Modal>
      <Modal
        isOpen={isEventModalOpen}
        onOpenChange={onEventModalOpenChange}
        placement="top-center"
      >
        <EventModal />
      </Modal>
    </div>
  )
}

export default DashboarPage