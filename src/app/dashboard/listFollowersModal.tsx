import React from 'react';
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableBody, TableCell, TableRow, TableColumn, Button } from '@nextui-org/react';
import { useSession } from 'next-auth/react';

interface UserData {
    _id: string;
    username: string;
    email: string;
}
interface ListFollowersModalProps {
    onClose: () => void;
  }

export default function ListFollowersModal({ onClose }: ListFollowersModalProps) {


    const { data: session } = useSession();
    const user = session?.user as any;

  return (

      <ModalContent>
        <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Listado de Seguidores</ModalHeader>
        <ModalBody>
        <Table removeWrapper aria-label="Example static collection table">
        <TableHeader>
                <TableColumn>Username</TableColumn>
                <TableColumn>Email</TableColumn>
          </TableHeader>
          <TableBody items={user.followers}>
         {(item: UserData) => (
        <TableRow key={item._id} style={{ color: 'white' }}>
            <TableCell>{item.username}</TableCell>
            <TableCell>{item.email}</TableCell>
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
