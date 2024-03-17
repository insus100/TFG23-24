"use client"
import { useEffect, useState } from "react";
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";
import CalendarTest from "../calendartest/page";
import { Button, Modal, useDisclosure, Input, Listbox } from '@nextui-org/react';
import EventModal from './eventModal'
import ShowInfoModal from './showInfoModal'
import ListCreatedEventsModal from './listCreatedEventsModal';
import ListAttendingEventsModal from './listAttendingEventsModal';
import axios from 'axios';
import { ChangeEvent } from 'react';



function DashboarPage() {
  //const _status = await getServerSession(authOptions)
  const { data: session, status } = useSession()
  const [events, setEvents] = useState([]);
  const [eventCreated, setEventCreated] = useState(false);
  const [eventModified, setEventModified] = useState(false);
  const { isOpen: isEventModalOpen, onOpen: onEventModalOpen, onOpenChange: onEventModalOpenChange } = useDisclosure();
  const { isOpen: isInfoModalOpen, onOpen: onInfoModalOpen, onOpenChange: onInfoModalOpenChange } = useDisclosure();
  const { isOpen: isListCreatedEventsModalOpen, onOpen: onListCreatedEventsModalOpen, onOpenChange: onListCreatedEventsModalOpenChange } = useDisclosure();
  const { isOpen: isListAttendingEventsModalOpen, onOpen: onListAttendingEventsModalOpen, onOpenChange: onListAttendingEventsModalOpenChange } = useDisclosure();
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  


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
    attendingUsers: []
  }

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEvents = events.filter((event: EventData) =>
  event.title.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleEventSelection = (selectedEvent: EventData) => {
  setSelectedEvent(selectedEvent);
  onInfoModalOpen();
};

  useEffect(() => {
    (async () => {
      try {
        await getAllEvents();
        if (eventCreated) {
          setEventCreated(false);
        }
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    })();
  }, [eventCreated]);

  const getAllEvents = async () => {
    const response = await axios.get('/api/events/createEvent');
    console.log("events", response);
    const fetchedEvents = response.data;
    const formattedEvents = fetchedEvents.map((event: EventData) => ({
      _id: event._id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      creator: event.creator,
      attendingUsers: event.attendingUsers
    }));
    setEvents(formattedEvents);
  };

  const irAPerfil = () => {
    return router.push('/profile')
  };

  const openEventInfoModal = (event: any) => {
    //console.log("Selected event", event);
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
      <div className="flex w-full items-center gap-4" style={{ position: 'relative' }} >
        <div className="flex-1" style={{ maxWidth: '200px', maxHeight: '100px' }}>
          <Input
            className="text-white px-4 py-4 w-full"
            type="text"
            placeholder="Buscar evento..."
            style={{ color: 'white' }} // Ajustar el ancho del borde y el color
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>
        {searchTerm && (
          <div style={{ position: 'absolute', top: '100%', left: 10, width: '10%', background: '#000', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 999, color: 'white' }}>
            {filteredEvents.map((event: EventData) => (
              <div key={event._id} onClick={() => handleEventSelection(event)}>
                {event.title}
              </div>
            ))}
          </div>
        )}
        <Button
          className="bg-blue-500 text-white px-4 py-2"
          style={{ width: '80px' }}
          onClick={() => setSearchTerm("")}
        >
          Borrar
        </Button>
      </div>

      <Button onPress={onEventModalOpen} className="bg-green-500 text-white px-4 py-2 block mt-4">
        Agregar Evento al Calendario
      </Button>
      <Button onPress={onListCreatedEventsModalOpen} className="bg-blue-500 text-white px-4 py-2 block mt-4">
        Ver Eventos Creados
      </Button>
      <Button onPress={onListAttendingEventsModalOpen} className="bg-blue-500 text-white px-4 py-2 block mt-4">
        Ver Eventos a los que me he apuntado
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
        onClose={async () => {setSelectedEvent(null); await getAllEvents();}}
      >
        {selectedEvent && (
          <ShowInfoModal selectedEvent={selectedEvent} setEventCreated={setEventCreated} />
        )}
      </Modal>
      <Modal
        isOpen={isEventModalOpen}
        onOpenChange={onEventModalOpenChange}
        placement="top-center"
      >
        <EventModal setEventCreated={setEventCreated} />
      </Modal>
      <Modal
        isOpen={isListCreatedEventsModalOpen}
        onOpenChange={onListCreatedEventsModalOpenChange}
        placement="top-center"
      >
        <ListCreatedEventsModal events={events} onClose={onListCreatedEventsModalOpenChange} />
      </Modal>
      <Modal
        isOpen={isListAttendingEventsModalOpen}
        onOpenChange={onListAttendingEventsModalOpenChange}
        placement="top-center"
      >
        <ListAttendingEventsModal events={events} onClose={onListAttendingEventsModalOpenChange} />
      </Modal>
    </div>
  )
}

export default DashboarPage