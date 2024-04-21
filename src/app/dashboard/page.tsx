"use client"
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react'
import CalendarTest from "../calendartest/page";
import { Modal, useDisclosure } from '@nextui-org/react';
import { FaRegStar } from "react-icons/fa";
import EventModal from './eventModal'
import ShowInfoModal from './showInfoModal'
import ShowUserModal from './showUserModal'
import ListCreatedEventsModal from './listCreatedEventsModal';
import ListAttendingEventsModal from './listAttendingEventsModal';
import ListFavoriteEventsModal from './listFavoriteEventsModal';
import ListFollowersModal from './listFollowersModal';
import ListRecommendationsModal from './listRecommendationsModal';
import axios from 'axios';
import MyNavbar from '../components/navbar';
import addNotification from "react-push-notification-18";



function DashboarPage() {
  const { data: session, status } = useSession()
  const user = session?.user as any;
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [userNotified, setUserNotified] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const { isOpen: isEventModalOpen, onOpen: onEventModalOpen, onOpenChange: onEventModalOpenChange } = useDisclosure();
  const { isOpen: isInfoModalOpen, onOpen: onInfoModalOpen, onOpenChange: onInfoModalOpenChange } = useDisclosure();
  const { isOpen: isListCreatedEventsModalOpen, onOpen: onListCreatedEventsModalOpen, onOpenChange: onListCreatedEventsModalOpenChange } = useDisclosure();
  const { isOpen: isListAttendingEventsModalOpen, onOpen: onListAttendingEventsModalOpen, onOpenChange: onListAttendingEventsModalOpenChange } = useDisclosure();
  const { isOpen: isListFavoriteEventsModalOpen, onOpen: onListFavoriteEventsModalOpen, onOpenChange: onListFavoriteEventsModalOpenChange } = useDisclosure();
  const { isOpen: isListFollowersModalOpen, onOpen: onListFollowersModalOpen, onOpenChange: onListFollowersModalOpenChange } = useDisclosure();
  const { isOpen: isListRecommendationsModalOpen, onOpen: onListRecommendationsModalOpen, onOpenChange: onListRecommendationsModalOpenChange } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { isOpen: isUserModalOpen, onOpen: onUserModalOpen, onOpenChange: onUserModalOpenChange } = useDisclosure();

  if (status === 'unauthenticated') {
    console.log("redirect to register");
  }

  
  useEffect(() => {
    (async () => {
      try {
        await getAllUsers();
        await getAllEvents();
        if (eventCreated) {
          setEventCreated(false);
        }
        if(user) {
          if(!userNotified) {
            setUserNotified(true);
            if(user.eventReminders && user.eventReminders.length > 0) {
              const date = ((new Date()).toISOString()).split("T")[0];
              user.eventReminders.forEach((r: any) => {
                if(r.reminder.split("T")[0] == date) {
                  addNotification({
                    title: 'Recordatorio',
                    subtitle: 'Recordatorio de evento',
                    message: `Título: ${r.event.title} | Fecha inicio: ${r.event.start.replace("T", " ").replace(".000Z", "")} | Fecha fin: ${r.event.end.replace("T", " ").replace(".000Z", "")}`,
                    theme: 'darkblue',
                    duration: 10000,
                    closeButton: 'X',
                    native: false, 
                });
                }
              })
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    })();
  }, [eventCreated, user]);

  const getAllEvents = async () => {
    const response = await axios.get('/api/events/createEvent');
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
    const fetchedUsers = response.data;
    setUsers(fetchedUsers);
  };

  const openEventInfoModal = (event: any) => {
    setSelectedEvent(event);
    onInfoModalOpen();
  }
  const components = {
    event: (props: any) => {
      const { attendingUsers, favorites } = props.event;
      const estaApuntado = attendingUsers.find((u: any) => u._id == user._id) ? true : false;
      const esFavorito = favorites.find((u: any) => u._id == user._id) ? true : false;
      if(estaApuntado) {
        return <div style={{ background: "green" }}>
          {esFavorito && <FaRegStar className="inline" color="yellow" />}
          {props.title}
        </div>
      }
      return <div>
        {esFavorito && <FaRegStar className="inline" color="yellow" />}
        {props.title}
      </div>
    }
  }
  return (
    <div>
      <MyNavbar
        users={users}
        events={events}
        setSelectedEvent={setSelectedEvent}
        onInfoModalOpen={onInfoModalOpen}
        setSelectedUser={setSelectedUser}
        onUserModalOpen={onUserModalOpen}
        onListCreatedEventsModalOpen={onListCreatedEventsModalOpen}
        onListAttendingEventsModalOpen={onListAttendingEventsModalOpen}
        onListFavoriteEventsModalOpen={onListFavoriteEventsModalOpen}
        onListFollowersModalOpen={onListFollowersModalOpen}
        onListRecommendationsModalOpen={onListRecommendationsModalOpen}
        onEventModalOpen={onEventModalOpen}
        page={"dashboard"}
      />
      <div className='justify-center flex items-center'>
        <CalendarTest
          events={events}
          openEventInfoModal={openEventInfoModal}
          components={components}
        />
      </div>
      <Modal
        isOpen={isInfoModalOpen}
        onOpenChange={onInfoModalOpenChange}
        placement="top-center"
        onClose={async () => { setSelectedEvent(null); await getAllEvents(); }}
        scrollBehavior="inside"
        size="3xl"
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
      <Modal
        isOpen={isListRecommendationsModalOpen}
        onOpenChange={onListRecommendationsModalOpenChange}
        placement="top-center"
        size="2xl"
      >
        <ListRecommendationsModal events={events} users={users} onClose={onListRecommendationsModalOpenChange} setEventCreated={setEventCreated} />
      </Modal>
    </div>
  )
}

export default DashboarPage