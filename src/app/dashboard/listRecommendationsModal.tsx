import React from 'react';
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableBody, TableCell, TableRow, TableColumn, Button, ButtonGroup } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import axios from "axios";
import { useState, useEffect } from "react";

interface EventData {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  creator: any;
  attendingUsers: any;
  favorites: any;
  recommendedBy: any;
  rejectedBy: any;
}

interface UserData {
    _id: string;
    username: string;
    email: string;
    followers: any;
}

interface ListRecommendationsEventsModalProps {
    events: EventData[];
    users: UserData[];
    onClose: () => void;
    setEventCreated: Function;
  }

export default function ListRecommendationsEventsModal({ events, users, onClose, setEventCreated }: ListRecommendationsEventsModalProps) {


    const { data: session } = useSession();
    const user = session?.user as any;

  // Lista para almacenar los eventos recomendados para el usuario actual
  const [recommendations, setRecommendations] = useState<EventData[]>([]);
  

    // Filter recommendations when events or users change
    useEffect(() => {
      const filteredRecommendations: EventData[] = [];
      events.forEach(event => {
          if (event.recommendedBy && event.recommendedBy.length > 0) {
              event.recommendedBy.forEach((recommendedUser: UserData) => {
                  const userRecommendator = users.find(u => u._id === recommendedUser._id);
                  if (userRecommendator && userRecommendator.followers && userRecommendator.followers.find((u: any) => u._id === user._id)) {
                      if(!event.attendingUsers.find((u:any) => u._id === user._id)){
                        if(!event.rejectedBy.find((a: any) => a._id === user._id)){
                          filteredRecommendations.push(event);
                        }
                      }
                  }
              });
          }
      });
      setRecommendations(filteredRecommendations);
  }, [events, users]);

  const apuntarseAEvento = async (selEvent: EventData) => {
      console.log("Apuntandose a evento: ", selEvent);
      const res = await axios.post('/api/events/apuntarse', {
          _id: selEvent._id,
          userId: user._id,
      });
      if(res.data.status === 'ok') {
          setEventCreated(true);
          // Remove the event from recommendations
          setRecommendations(prevRecommendations => prevRecommendations.filter(event => event._id !== selEvent._id));
      }
  }

  const rechazarRecomendacion = async (selEvent: EventData) => {
    console.log("Rechazando evento: ", selEvent);
    const res = await axios.post('/api/events/rechazarEvento', {
        _id: selEvent._id,
        userId: user._id,
    });
    if(res.data.status === 'ok') {
        setEventCreated(true);
        // Remove the event from recommendations
        setRecommendations(prevRecommendations => prevRecommendations.filter(event => event._id !== selEvent._id));
    }
}


  return (

      <ModalContent>
        <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Listado de Eventos Recomendados</ModalHeader>
        <ModalBody>
        <Table removeWrapper aria-label="Example static collection table">
          <TableHeader>
                <TableColumn>Título</TableColumn>
                <TableColumn>Inicio</TableColumn>
                <TableColumn>Fin</TableColumn>
                <TableColumn>Acciones</TableColumn>
          </TableHeader>
         <TableBody items={recommendations}>
         {(item) => (
        <TableRow key={item._id} style={{ color: 'white' }}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.start.toLocaleString()}</TableCell>
            <TableCell>{item.end.toLocaleString()}</TableCell>
            <TableCell><ButtonGroup>{item && user ? <>
                    <Button color="success" variant="flat" onPress={(e) => apuntarseAEvento(item)} >
                      Aceptar
                    </Button>
              </> : null }<Button color="danger" variant="flat" onPress={(e) => rechazarRecomendacion(item)}>Rechazar</Button></ButtonGroup></TableCell>
        </TableRow>
        )}
          </TableBody>
        </Table>
        </ModalBody>
      <ModalFooter>
        <Button type="submit" onClick={onClose}>Cerrar</Button>
      </ModalFooter>
      </ModalContent>
  );
};
