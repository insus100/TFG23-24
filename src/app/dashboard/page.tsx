"use client"
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react'
import CalendarTest from "../calendartest/page";
import { Button, Modal, useDisclosure } from '@nextui-org/react';
import EventModal from './eventModal'
import ShowInfoModal from './showInfoModal'
import ShowUserModal from './showUserModal'
import ListCreatedEventsModal from './listCreatedEventsModal';
import ListAttendingEventsModal from './listAttendingEventsModal';
import ListFavoriteEventsModal from './listFavoriteEventsModal';
import ListFollowersModal from './listFollowersModal';
import axios from 'axios';
import MyNavbar from '../components/navbar';



function DashboarPage() {
  //const _status = await getServerSession(authOptions)
  const { data: session, status } = useSession()
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [eventCreated, setEventCreated] = useState(false);
  const { isOpen: isEventModalOpen, onOpen: onEventModalOpen, onOpenChange: onEventModalOpenChange } = useDisclosure();
  const { isOpen: isInfoModalOpen, onOpen: onInfoModalOpen, onOpenChange: onInfoModalOpenChange } = useDisclosure();
  const { isOpen: isListCreatedEventsModalOpen, onOpen: onListCreatedEventsModalOpen, onOpenChange: onListCreatedEventsModalOpenChange } = useDisclosure();
  const { isOpen: isListAttendingEventsModalOpen, onOpen: onListAttendingEventsModalOpen, onOpenChange: onListAttendingEventsModalOpenChange } = useDisclosure();
  const { isOpen: isListFavoriteEventsModalOpen, onOpen: onListFavoriteEventsModalOpen, onOpenChange: onListFavoriteEventsModalOpenChange } = useDisclosure();
  const { isOpen: isListFollowersModalOpen, onOpen: onListFollowersModalOpen, onOpenChange: onListFollowersModalOpenChange } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { isOpen: isUserModalOpen, onOpen: onUserModalOpen, onOpenChange: onUserModalOpenChange } = useDisclosure();

  if (status === 'unauthenticated') {
    console.log("redirect to register");
    //return redirect('/login');
  }


  useEffect(() => {
    (async () => {
      try {
        await getAllUsers();
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
    const formattedEvents = fetchedEvents.map(({start, end, ...rest}: any) => ({
      start: new Date(start),
      end: new Date(end),
      ...rest
    }));
    setEvents(formattedEvents);
  };

  const getAllUsers = async () => {
    const response = await axios.get('/api/users');
    console.log("users", response);
    const fetchedUsers = response.data;
    setUsers(fetchedUsers);
  };

  const openEventInfoModal = (event: any) => {
    //console.log("Selected event", event);
    setSelectedEvent(event);
    onInfoModalOpen();
  }

  return (
    <div>
      <MyNavbar users={users} events={events} setSelectedEvent={setSelectedEvent} onInfoModalOpen={onInfoModalOpen} setSelectedUser={setSelectedUser} onUserModalOpen={onUserModalOpen}/>
      <Button onPress={onEventModalOpen} className="bg-green-500 text-white px-4 py-2 block mt-4">
        Agregar Evento al Calendario
      </Button>
      <Button onPress={onListCreatedEventsModalOpen} className="bg-blue-500 text-white px-4 py-2 block mt-4">
        Ver Eventos Creados
      </Button>
      <Button onPress={onListAttendingEventsModalOpen} className="bg-blue-500 text-white px-4 py-2 block mt-4">
        Ver Eventos a los que me he apuntado
      </Button>
      <Button onPress={onListFavoriteEventsModalOpen} className="bg-blue-500 text-white px-4 py-2 block mt-4">
        Ver Eventos Favoritos
      </Button>
      <Button onPress={onListFollowersModalOpen} className="bg-blue-500 text-white px-4 py-2 block mt-4">
        Ver Seguidores
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
        onClose={async () => { setSelectedEvent(null); await getAllEvents(); }}
        scrollBehavior="inside"
        size="2xl"
      >
        {selectedEvent && (
          <ShowInfoModal selectedEvent={selectedEvent} setEventCreated={setEventCreated} />
        )}
      </Modal>
      <Modal
        isOpen={isUserModalOpen}
        onOpenChange={onUserModalOpenChange}
        placement="top-center"
        onClose={async () => { setSelectedUser(null); await getAllUsers(); }}
        scrollBehavior="inside"
        size="2xl"
      >
        {selectedUser && (
          <ShowUserModal selectedUser={selectedUser}/>
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
      <Modal
        isOpen={isListFavoriteEventsModalOpen}
        onOpenChange={onListFavoriteEventsModalOpenChange}
        placement="top-center"
      >
        <ListFavoriteEventsModal events={events} onClose={onListFavoriteEventsModalOpenChange} />
      </Modal>
      <Modal
        isOpen={isListFollowersModalOpen}
        onOpenChange={onListFollowersModalOpenChange}
        placement="top-center"
      >
        <ListFollowersModal onClose={onListFollowersModalOpenChange} />
      </Modal>
    </div>
  )
}

export default DashboarPage