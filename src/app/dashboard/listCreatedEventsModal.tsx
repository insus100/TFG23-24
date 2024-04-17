import React from 'react';
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableBody, TableCell, TableRow, TableColumn, Button } from '@nextui-org/react';
import { useSession } from 'next-auth/react';

interface EventData {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  creator: any;
  attendingUsers: any;
}

interface ListCreatedEventsModalProps {
    events: EventData[];
    onClose: () => void;
  }

export default function ListCreatedEventsModal({ events, onClose }: ListCreatedEventsModalProps) {


    const { data: session } = useSession();
    const userEvents = events.filter(event => event.creator.email === session?.user?.email);


  return (

      <ModalContent>
        <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Listado de Eventos</ModalHeader>
        <ModalBody>
        <Table removeWrapper aria-label="Example static collection table">
          <TableHeader>
                <TableColumn>Título</TableColumn>
                <TableColumn>Inicio</TableColumn>
                <TableColumn>Fin</TableColumn>
                <TableColumn>Creador</TableColumn>
                <TableColumn>Asistentes</TableColumn>
          </TableHeader>
         <TableBody items={userEvents}>
         {(item) => (
        <TableRow key={item._id} style={{ color: 'white' }}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.start.toLocaleString()}</TableCell>
            <TableCell>{item.end.toLocaleString()}</TableCell>
            <TableCell>{item.creator.username}</TableCell>
            <TableCell>
              <ul>
                {item.attendingUsers.map((user: { username: string }, index: number) => (
                  <li key={index}>{user.username}</li>
                ))}
              </ul>
            </TableCell>
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
