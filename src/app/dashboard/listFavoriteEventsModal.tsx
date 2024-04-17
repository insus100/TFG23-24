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
  favorites: any;
}

interface ListFavoriteEventsModalProps {
    events: EventData[];
    onClose: () => void;
  }

export default function ListAttendingEventsModal({ events, onClose }: ListFavoriteEventsModalProps) {


    const { data: session } = useSession();
      const userFavoriteEvents = events.filter(event =>
    event.favorites.some((user: { email: string }) => user.email === session?.user?.email)
  );


  return (

      <ModalContent>
        <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Listado de Eventos Favoritos</ModalHeader>
        <ModalBody>
        <Table removeWrapper aria-label="Example static collection table">
          <TableHeader>
                <TableColumn>Título</TableColumn>
                <TableColumn>Inicio</TableColumn>
                <TableColumn>Fin</TableColumn>
                <TableColumn>Creador</TableColumn>
          </TableHeader>
         <TableBody items={userFavoriteEvents}>
         {(item) => (
        <TableRow key={item._id} style={{ color: 'white' }}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.start.toLocaleString()}</TableCell>
            <TableCell>{item.end.toLocaleString()}</TableCell>
            <TableCell>{item.creator.username}</TableCell>
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
