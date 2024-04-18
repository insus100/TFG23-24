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
  recommendedBy: any
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
  }

export default function ListRecommendationsEventsModal({ events, users, onClose }: ListRecommendationsEventsModalProps) {


    const { data: session } = useSession();
    const user = session?.user as any;

  // Lista para almacenar los eventos recomendados para el usuario actual
  const recommendations: EventData[] = [];

  // Iterar sobre los eventos
  events.forEach(event => {
    // Verificar si hay usuarios en recommendedBy
    if (event.recommendedBy && event.recommendedBy.length > 0) {
      // Iterar sobre los usuarios recomendadores
      event.recommendedBy.forEach((recommendedUser: UserData) => {
        // Buscar al usuario recomendador en el array de usuarios
        const userRecommendator = users.find(u => u._id === recommendedUser._id);
        // Verificar si el usuario recomendador tiene al usuario actual en sus seguidores
        if (userRecommendator && userRecommendator.followers && userRecommendator.followers.some((followerId: string) => followerId === user._id)) {
          // Agregar el evento a las recomendaciones
          recommendations.push(event);
        }
      });
    }
  });



  return (

      <ModalContent>
        <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Listado de Eventos Recomendados</ModalHeader>
        <ModalBody>
        <Table removeWrapper aria-label="Example static collection table">
          <TableHeader>
                <TableColumn>Título</TableColumn>
                <TableColumn>Inicio</TableColumn>
                <TableColumn>Fin</TableColumn>
                <TableColumn>Creador</TableColumn>
          </TableHeader>
         <TableBody items={recommendations}>
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
